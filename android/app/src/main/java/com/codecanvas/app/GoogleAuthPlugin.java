package com.codecanvas.app;

import android.content.Intent;
import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {
    private static final String TAG = "GoogleAuthPlugin";
    private static final int RC_SIGN_IN = 9001;
    private GoogleSignInClient mGoogleSignInClient;
    private PluginCall savedCall;

    @Override
    public void load() {
        try {
            String serverClientId = getContext().getString(R.string.server_client_id);
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(serverClientId)
                    .requestEmail()
                    .requestProfile()
                    .build();

            mGoogleSignInClient = GoogleSignIn.getClient(getActivity(), gso);
            Log.d(TAG, "GoogleAuthPlugin initialized successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error initializing GoogleAuthPlugin: " + e.getMessage());
        }
    }

    @PluginMethod
    public void signIn(PluginCall call) {
        try {
            if (mGoogleSignInClient == null) {
                call.reject("Google Sign-In client not initialized");
                return;
            }

            savedCall = call;
            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
            startActivityForResult(call, signInIntent, RC_SIGN_IN);
        } catch (Exception e) {
            Log.e(TAG, "Error starting sign in: " + e.getMessage());
            call.reject("Failed to start sign in", e);
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            JSObject result = new JSObject();
            result.put("id", account.getId());
            result.put("email", account.getEmail());
            result.put("displayName", account.getDisplayName());
            result.put("photoUrl", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : null);
            result.put("idToken", account.getIdToken());

            if (savedCall != null) {
                savedCall.resolve(result);
            }
        } catch (ApiException e) {
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
            if (savedCall != null) {
                savedCall.reject("Sign in failed", String.valueOf(e.getStatusCode()));
            }
        } finally {
            savedCall = null;
        }
    }

    @PluginMethod
    public void signOut(PluginCall call) {
        if (mGoogleSignInClient == null) {
            call.reject("Google Sign-In client not initialized");
            return;
        }

        mGoogleSignInClient.signOut()
            .addOnCompleteListener(getActivity(), task -> {
                if (task.isSuccessful()) {
                    call.resolve();
                } else {
                    call.reject("Sign out failed");
                }
            });
    }
}