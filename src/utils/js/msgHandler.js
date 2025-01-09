import Notiflix from "notiflix";
import i18n from "@locales";

export const msgHandler = {
  nodeText: document.getElementById("msg-out"),
  lastMessage: "",
  sendMessage(msg, type, system = true) {
    if (type === "error") {
      Notiflix.Notify.failure(msg, {
        ID: "msgHandlerErr",
        zindex: 114515,
        cssAnimationStyle: "fade",
        showOnlyTheLastOne: false,
        opacity: "0.8",
        borderRadius: "15px",
      });
    } else if (type === "success") {
      Notiflix.Notify.success(msg, {
        ID: "msgHandlerSuccess",
        zindex: 114515,
        cssAnimationStyle: "fade",
        showOnlyTheLastOne: false,
        opacity: "0.8",
        borderRadius: "15px",
      });
    } else {
      Notiflix.Notify.info(msg, {
        ID: "msgHandlerInfo",
        zindex: 114515,
        cssAnimationStyle: "fade",
        clickToClose: true,
        showOnlyTheLastOne: false,
        opacity: "0.8",
        borderRadius: "15px",
      });
    }
  },
  confirm(msg, title, yes, no) {
    if (!title) title = i18n.global.t("info.info");
    if (!yes) yes = i18n.global.t("info.yes");
    if (!no) no = i18n.global.t("info.no");
    return new Promise((res) => {
      Notiflix.Confirm.show(
        title,
        msg,
        yes,
        no,
        () => {
          res(true);
        },
        () => {
          res(false);
        },
        {
          zindex: 114515,
          titleColor: "black",
          okButtonBackground: "#90caf9",
          messageMaxLength: 1000,
          plainText: false,
        }
      );
    });
  },
  info(msg, title, yes, type = "info") {
    if (!title) title = i18n.global.t("info.info");
    if (!yes) yes = i18n.global.t("info.ok");
    return new Promise((res) => {
      Notiflix.Report[type](
        title,
        msg,
        yes,
        () => {
          res(true);
        },
        {
          zindex: 114515,
          titleColor: "black",
          buttonBackground: "#90caf9",
          svgSize: "30px",
        }
      );
    });
  },
  success(msg, title, yes) {
    if (!title) title = i18n.global.t("info.info");
    if (!yes) yes = i18n.global.t("info.ok");
    return this.info(msg, title, yes, "success");
  },
  failure(msg, title, yes) {
    if (!title) title = i18n.global.t("info.failure");
    if (!yes) yes = i18n.global.t("info.ok");
    return this.info(msg, title, yes, "failure");
  },
  warning(msg, title, yes) {
    if (!title) title = i18n.global.t("info.warning");
    if (!yes) yes = i18n.global.t("info.ok");
    return this.info(msg, title, yes, "warning");
  },
  prompt(msg, title, yes, no, placeholder = "") {
    if (!title) title = i18n.global.t("info.info");
    if (!yes) yes = i18n.global.t("info.confirm");
    if (!no) no = i18n.global.t("info.cancel");
    return new Promise(function (res) {
      Notiflix.Confirm.prompt(
        title,
        msg,
        placeholder,
        yes,
        no,
        (clientAnswer) => {
          res(clientAnswer);
        },
        (clientAnswer) => {
          res(null);
        },
        {
          zindex: 114515,
          titleColor: "black",
          okButtonBackground: "#90caf9",
        }
      );
    });
  },
}; 