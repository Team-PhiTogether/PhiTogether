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
    
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated);
//        NotificationCenter.default.addObserver(self, selector: #selector(applicationDidBecomeActive), name: UIApplication.didBecomeActiveNotification, object: nil)
//        NotificationCenter.default.addObserver(self, selector: #selector(applicationWillResignActive), name: UIApplication.willResignActiveNotification, object: nil)
        // 隐藏导航条等
        self.becomeFirstResponder()
        self.navigationController?.navigationBar.isHidden = true
        self.navigationController?.navigationBar.setBackgroundImage(UIImage(), for: .default)
        self.navigationController?.navigationBar.shadowImage = UIImage()
    }
}
