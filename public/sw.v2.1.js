"use strict";

var cacheStorageKey = "PTv0-";

const CORE = ["/"];

function parseURL(url) {
  let tmp = url.substr(url.indexOf("//") + 2);
  let host = tmp.substr(0, tmp.indexOf("/"));
  let tmp2 = tmp.substr(tmp.indexOf("/"));
  let qm = tmp2.indexOf("?");
  let path, queryParam;
  if (qm < 0) {
    path = tmp2;
    queryParam = undefined;
  } else {
    path = tmp2.substr(0, qm);
    queryParam = tmp2.substr(qm);
  }

  return {
    path,
    host,
    queryParam,
  };
}

function cacheFirst(request, key) {
  return caches.open(key).then((cache) => {
    return cache
      .match(request, { ignoreSearch: true, ignoreVary: true })
      .then((response) => {
        return (
          response ||
          fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
        );
      });
  });
}

function cacheOrOnline(request, key) {
  return caches.open(key).then((cache) => {
    return cache
      .match(request, { ignoreSearch: true, ignoreVary: true })
      .then((response) => {
        return response || fetch(request);
      });
  });
}

function onlineFirst(request, key) {
  return caches.open(key).then((cache) => {
    const offlineFetch = () => {
      return cache.match(request).then((response) => {
        return response;
      });
    };
    if (!navigator.onLine) return offlineFetch();
    return fetch(request)
      .then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
      .catch(offlineFetch);
  });
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheStorageKey + "Main").then(function (cache) {
      return cache.addAll(CORE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", async function (e) {
  const urlParsed = parseURL(e.request.url);
  const urlOri = e.request.url;
  if (urlOri.startsWith("http")) {
    if (
      urlParsed.queryParam &&
      urlParsed.queryParam.includes("nocacahe=nocache")
    ) {
      // 正常加载 && 旧 CacheStorage 迁移
      e.respondWith(
        cacheOrOnline(
          e.request,
          cacheStorageKey +
            (urlParsed.queryParam && urlParsed.queryParam.includes("key=Main")
              ? "Main"
              : "Charts")
        )
      );
      return;
    } else if (
      urlParsed.path.startsWith("/api/") ||
      ((urlParsed.host.startsWith("api.") ||
        urlParsed.host.startsWith("dev.")) &&
        urlParsed.host.includes("phi"))
    ) {
      // 各类 Api
      return;
    } else if (
      ["res.phizone.cn", "res.phi.zone"].includes(urlParsed.host) ||
      urlParsed.path.startsWith("/PTVirtual/") ||
      urlParsed.path.startsWith("/src/core/charts/")
    ) {
      if (
        urlParsed.path.startsWith("/user/") ||
        urlParsed.path.startsWith("/PTVirtual/user/")
      ) {
        e.respondWith(cacheFirst(e.request, cacheStorageKey + "User"));
        return;
      }
      e.respondWith(cacheOrOnline(e.request, cacheStorageKey + "Charts"));
      return;
    } else if (
      urlParsed.host.endsWith("ptc.realtvop.eu.org") ||
      urlParsed.host === "chart.phitogether.fun" ||
      urlParsed.host.endsWith("ptc.realtvop.top")
    ) {
      // PhiTogether Community
      if (
        !urlParsed.path.includes("songs.json") &&
        !urlParsed.path.includes("chapters.json")
      )
        e.respondWith(cacheFirst(e.request, cacheStorageKey + "Charts"));
      return;
    } else if (
      urlParsed.host.endsWith("realtvop.eu.org") &&
      !urlParsed.host.includes("er-vi")
    ) {
      // TODO: realtvop答应写资源包管理器
      e.respondWith(
        cacheFirst(e.request, cacheStorageKey + "Res-" + urlParsed.host)
      );
      return;
    } else {
      if (self.location.port === "1145") return;
      if (urlParsed.path.startsWith("/#/")) {
        e.respondWith(cacheFirst("/", cacheStorageKey + "Main"));
        return;
      }
      e.respondWith(cacheFirst(e.request, cacheStorageKey + "Main"));
      return;
    }
  }
  return;
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheNames) => {
              return !cacheNames.startsWith(cacheStorageKey);
            })
            .map((cacheNames) => {
              return caches.delete(cacheNames);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});
