import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {
    // 隐藏通知和homebar
    override var prefersStatusBarHidden: Bool { return true }
//    override var prefersHomeIndicatorAutoHidden: Bool { return true }
    // 禁止各种手势
    override var editingInteractionConfiguration: UIEditingInteractionConfiguration { return .none }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { return .all }
    override var canBecomeFirstResponder: Bool { return true }
//    override var prefersHomeIndicatorAutoHidden: Bool { return true }
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
            if motion == .motionShake {/* 就不給你撤銷 */}
    }
    
    
//    override var prefersHomeIndicatorAutoHidden: Bool {
//        return true  // Returns true to hide the home indicator
//    }
//    override var childForHomeIndicatorAutoHidden: UIViewController? {
//           return self
//       }
    
    
    @objc func applicationWillResignActive(notification: NSNotification) {
        if(self.isViewLoaded && (self.view.window != nil) && (self.webView != nil)) {
//            if ((self.webView?.url?.absoluteString ??  "").contains("phitogether.fun")) {
                self.webView?.evaluateJavaScript("hook.pause('exited')", completionHandler: nil)
//            }
        }
        }

           @objc func applicationDidBecomeActive(notification: NSNotification) {
               if(self.isViewLoaded && (self.view.window != nil)) {
                   let soundWarnSent = UserDefaults.standard.bool(forKey: "soundWarnSent");
                   if(soundWarnSent) {
                       return;
                   }
                   if #available(iOS 13.0, *){
                           let alertController = UIAlertController(title: "提示", message: "因iOS系统bug，PhiTogether被切至后台重新打开可能无法正常播放声音，您可以通过清除 PhiTogether 后台然后重启 PhiTogether 解决问题。", preferredStyle: .alert)
                           let okBtn = UIAlertAction(title: "好/OK", style: .default, handler: nil)
                           alertController.addAction(okBtn)
                           self.present(alertController, animated: true)
                           UserDefaults.standard.set(true, forKey: "soundWarnSent")
                   }
               }
           }
    
    @objc func handleAudioRouteChange(notification: Notification) {
            let js = """
            if (typeof Audio !== 'undefined') {
                var audio = document.getElementsByTagName('audio');
                for(var i = 0; i < audio.length; i++) {
                    audio[i].load();
                }
            }
            """
        self.webView?.evaluateJavaScript(js, completionHandler: nil)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated);
        NotificationCenter.default.addObserver(self, selector: #selector(applicationDidBecomeActive), name: UIApplication.didBecomeActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(applicationWillResignActive), name: UIApplication.willResignActiveNotification, object: nil)
        // 隐藏导航条等
        self.becomeFirstResponder()
        self.navigationController?.navigationBar.isHidden = true
        self.navigationController?.navigationBar.setBackgroundImage(UIImage(), for: .default)
        self.navigationController?.navigationBar.shadowImage = UIImage()
        self.webView?.configuration.allowsInlineMediaPlayback = true
        self.webView?.configuration.mediaTypesRequiringUserActionForPlayback = []
        // Call this when you want to update the home indicator's visibility
//        setNeedsUpdateOfHomeIndicatorAutoHidden()
    }
}

//class CustomNavigationController: UINavigationController {
//    override var prefersHomeIndicatorAutoHidden: Bool {
//        return true
//    }
//    
//    override var childForHomeIndicatorAutoHidden: UIViewController? {
//        return topViewController
//    }
//}
