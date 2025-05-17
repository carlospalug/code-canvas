package com.codecanvas.app;

import android.app.Activity;
import android.util.Log;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import java.util.ArrayList;
import java.util.List;

public class BillingManager implements PurchasesUpdatedListener {
    private static final String TAG = "BillingManager";
    private static final String MONTHLY_PRODUCT_ID = "code_samples_monthly";
    private static final String YEARLY_PRODUCT_ID = "code_samples_yearly";

    private final BillingClient billingClient;
    private final Activity activity;
    private ProductDetails monthlyProduct;
    private ProductDetails yearlyProduct;
    private BillingCallback callback;

    public interface BillingCallback {
        void onPurchaseComplete(boolean success, String message);
        void onSubscriptionStatusChanged(boolean isActive);
    }

    public BillingManager(Activity activity, BillingCallback callback) {
        this.activity = activity;
        this.callback = callback;
        
        billingClient = BillingClient.newBuilder(activity)
            .setListener(this)
            .enablePendingPurchases()
            .build();
        
        startConnection();
    }

    private void startConnection() {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    queryProductDetails();
                    queryExistingPurchases();
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // Retry connection
                startConnection();
            }
        });
    }

    private void queryProductDetails() {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        
        productList.add(QueryProductDetailsParams.Product.newBuilder()
            .setProductId(MONTHLY_PRODUCT_ID)
            .setProductType(BillingClient.ProductType.SUBS)
            .build());
            
        productList.add(QueryProductDetailsParams.Product.newBuilder()
            .setProductId(YEARLY_PRODUCT_ID)
            .setProductType(BillingClient.ProductType.SUBS)
            .build());

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                for (ProductDetails product : productDetailsList) {
                    if (product.getProductId().equals(MONTHLY_PRODUCT_ID)) {
                        monthlyProduct = product;
                    } else if (product.getProductId().equals(YEARLY_PRODUCT_ID)) {
                        yearlyProduct = product;
                    }
                }
            }
        });
    }

    private void queryExistingPurchases() {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build();

        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                boolean hasActiveSubscription = false;
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        hasActiveSubscription = true;
                        if (!purchase.isAcknowledged()) {
                            acknowledgePurchase(purchase);
                        }
                    }
                }
                callback.onSubscriptionStatusChanged(hasActiveSubscription);
            }
        });
    }

    public void purchaseSubscription(boolean yearly) {
        ProductDetails product = yearly ? yearlyProduct : monthlyProduct;
        if (product == null) {
            callback.onPurchaseComplete(false, "Product not available");
            return;
        }

        List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
        productDetailsParamsList.add(
            BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(product)
                .setOfferToken(product.getSubscriptionOfferDetails().get(0).getOfferToken())
                .build()
        );

        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(productDetailsParamsList)
            .build();

        billingClient.launchBillingFlow(activity, billingFlowParams);
    }

    private void acknowledgePurchase(Purchase purchase) {
        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.getPurchaseToken())
            .build();

        billingClient.acknowledgePurchase(params, billingResult -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                Log.d(TAG, "Purchase acknowledged");
            }
        });
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    callback.onPurchaseComplete(true, "Purchase successful");
                    if (!purchase.isAcknowledged()) {
                        acknowledgePurchase(purchase);
                    }
                }
            }
        } else {
            callback.onPurchaseComplete(false, "Purchase failed: " + billingResult.getDebugMessage());
        }
    }

    public void destroy() {
        if (billingClient != null && billingClient.isReady()) {
            billingClient.endConnection();
        }
    }
}