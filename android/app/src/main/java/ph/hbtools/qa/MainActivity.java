package ph.hbtools.qa;

import android.app.Activity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.inputmethod.EditorInfo;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class MainActivity extends Activity {
    private WebView web;
    private EditText urlBox;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);

        LinearLayout bar = new LinearLayout(this);
        bar.setOrientation(LinearLayout.HORIZONTAL);
        bar.setGravity(Gravity.CENTER_VERTICAL);

        urlBox = new EditText(this);
        urlBox.setSingleLine(true);
        urlBox.setText("https://happybingo.ph");
        urlBox.setImeOptions(EditorInfo.IME_ACTION_GO);
        urlBox.setTextSize(12);
        urlBox.setOnEditorActionListener((v, id, e) -> { go(); return true; });
        bar.addView(urlBox, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

        bar.addView(button("Go", () -> go()));
        bar.addView(button("Test", () -> run("hbtest.js")));
        root.addView(bar);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        root.addView(web, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));

        setContentView(root);
        web.loadUrl("https://happybingo.ph");
    }

    private Button button(String label, Runnable r) {
        Button x = new Button(this);
        x.setText(label);
        x.setTextSize(11);
        x.setAllCaps(false);
        x.setOnClickListener(v -> r.run());
        return x;
    }

    private void go() {
        String u = urlBox.getText().toString().trim();
        if (!u.startsWith("http")) u = "https://" + u;
        web.loadUrl(u);
    }

    private void run(String asset) {
        try (InputStream in = getAssets().open(asset)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            web.evaluateJavascript(out.toString("UTF-8"), null);
        } catch (Exception e) {
            android.widget.Toast.makeText(this, "Script error: " + e.getMessage(), android.widget.Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
