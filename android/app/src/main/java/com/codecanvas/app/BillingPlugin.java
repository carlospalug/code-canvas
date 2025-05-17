package com.codecanvas.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Billing")
public class BillingPlugin extends Plugin {
    private BillingManager billingManager;

    @Override
    public void load() {
        billingManager = new BillingManager(getActivity(), new BillingManager.BillingCallback() {
            @Override
            public void onPurchaseComplete(boolean success, String message) {
                JSObject ret = new JSObject();
                ret.put("success", success);
                ret.put("message", message);
                notifyListeners("purchaseComplete", ret);
            }

            @Override
            public void onSubscriptionStatusChanged(boolean isActive) {
                JSObject ret = new JSObject();
                ret.put("isActive", isActive);
                notifyListeners("subscriptionStatusChanged", ret);
            }
        });
    }

    @PluginMethod
    public void subscribe(PluginCall call) {
        String plan = call.getString("plan", "monthly");
        billingManager.purchaseSubscription(plan.equals("yearly"));
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (billingManager != null) {
            billingManager.destroy();
        }
        super.handleOnDestroy();
    }
}