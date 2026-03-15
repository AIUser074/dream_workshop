(() => {
  // node_modules/@apps-in-toss/bridge-core/dist/index.js
  var NativeWindow = class {
    get _window() {
      if (typeof window !== "undefined") {
        return window;
      }
      return {
        ReactNativeWebView: {
          postMessage: () => {
          }
        },
        __GRANITE_NATIVE_EMITTER: {
          on: () => () => {
          }
        },
        __CONSTANT_HANDLER_MAP: {}
      };
    }
    postMessage(message) {
      const webView = this._window.ReactNativeWebView;
      if (!webView) {
        throw new Error("ReactNativeWebView is not available in browser environment");
      }
      webView.postMessage(JSON.stringify(message));
    }
    on(event, callback) {
      const emitter = this._window.__GRANITE_NATIVE_EMITTER;
      if (!emitter) {
        throw new Error("__GRANITE_NATIVE_EMITTER is not available");
      }
      return emitter.on(event, callback);
    }
    getConstant(method) {
      const constantHandlerMap = this._window.__CONSTANT_HANDLER_MAP;
      if (constantHandlerMap && method in constantHandlerMap) {
        return constantHandlerMap[method];
      }
      throw new Error(`${method} is not a constant handler`);
    }
  };
  var nativeWindow = new NativeWindow();
  var createEventId = () => Math.random().toString(36).substring(2, 15);
  var deserializeError = (value) => {
    if (value && value.__isError) {
      const err = new Error(value.message);
      for (const [key, val] of Object.entries(value)) {
        err[key] = val;
      }
      return err;
    }
    return value;
  };
  function createAsyncBridge(method) {
    return (...args) => {
      const eventId = createEventId();
      const emitters = [];
      const unsubscribe = () => {
        for (const remove of emitters) {
          remove();
        }
      };
      return new Promise((resolve, reject) => {
        emitters.push(
          nativeWindow.on(`${method}/resolve/${eventId}`, (data) => {
            unsubscribe();
            resolve(data);
          })
        );
        emitters.push(
          nativeWindow.on(`${method}/reject/${eventId}`, (error) => {
            unsubscribe();
            reject(deserializeError(error));
          })
        );
        nativeWindow.postMessage({
          type: "method",
          functionName: method,
          eventId,
          args
        });
      });
    };
  }
  function createEventBridge(method) {
    return (args) => {
      const eventId = createEventId();
      const removes = [
        nativeWindow.on(`${method}/onEvent/${eventId}`, (data) => {
          args.onEvent(data);
        }),
        nativeWindow.on(`${method}/onError/${eventId}`, (error) => {
          args.onError(deserializeError(error));
        })
      ];
      nativeWindow.postMessage({
        type: "addEventListener",
        functionName: method,
        eventId,
        args: args.options
      });
      return () => {
        nativeWindow.postMessage({
          type: "removeEventListener",
          functionName: method,
          eventId
        });
        removes.forEach((remove) => remove());
      };
    };
  }
  function createConstantBridge(method) {
    return () => {
      return nativeWindow.getConstant(method);
    };
  }

  // node_modules/@apps-in-toss/web-bridge/built/bridge.js
  var createEvents = function() {
    return { emit: function emit(event, args) {
      for (var callbacks = this.events[event] || [], i = 0, length = callbacks.length; i < length; i++) {
        callbacks[i](args);
      }
    }, events: {}, on: function on(event, cb) {
      var _this = this;
      var _this_events, _event;
      ((_this_events = this.events)[_event = event] || (_this_events[_event] = [])).push(cb);
      return function() {
        var _this_events_event;
        _this.events[event] = (_this_events_event = _this.events[event]) === null || _this_events_event === void 0 ? void 0 : _this_events_event.filter(function(i) {
          return cb !== i;
        });
      };
    } };
  };
  if (typeof window !== "undefined") {
    window.__GRANITE_NATIVE_EMITTER = createEvents();
  }
  var closeView = createAsyncBridge("closeView");
  var generateHapticFeedback = createAsyncBridge("generateHapticFeedback");
  var share = createAsyncBridge("share");
  var setSecureScreen = createAsyncBridge("setSecureScreen");
  var setScreenAwakeMode = createAsyncBridge("setScreenAwakeMode");
  var getNetworkStatus = createAsyncBridge("getNetworkStatus");
  var setIosSwipeGestureEnabled = createAsyncBridge("setIosSwipeGestureEnabled");
  var openURL = createAsyncBridge("openURL");
  var openPermissionDialog = createAsyncBridge("openPermissionDialog");
  var getPermission = createAsyncBridge("getPermission");
  var requestPermission = createAsyncBridge("requestPermission");
  var setClipboardText = createConstantBridge("setClipboardText");
  var getClipboardText = createConstantBridge("getClipboardText");
  var fetchContacts = createConstantBridge("fetchContacts");
  var fetchAlbumPhotos = createConstantBridge("fetchAlbumPhotos");
  var getCurrentLocation = createConstantBridge("getCurrentLocation");
  var openCamera = createConstantBridge("openCamera");
  var appLogin = createAsyncBridge("appLogin");
  var eventLog = createAsyncBridge("eventLog");
  var getTossShareLink = createAsyncBridge("getTossShareLink");
  var setDeviceOrientation = createAsyncBridge("setDeviceOrientation");
  var checkoutPayment = createAsyncBridge("checkoutPayment");
  var saveBase64Data = createAsyncBridge("saveBase64Data");
  var appsInTossSignTossCert = createAsyncBridge("appsInTossSignTossCert");
  var getGameCenterGameProfile = createAsyncBridge("getGameCenterGameProfile");
  var openGameCenterLeaderboard = createAsyncBridge("openGameCenterLeaderboard");
  var submitGameCenterLeaderBoardScore = createAsyncBridge("submitGameCenterLeaderBoardScore");
  var getUserKeyForGame = createAsyncBridge("getUserKeyForGame");
  var grantPromotionRewardForGame = createAsyncBridge("grantPromotionRewardForGame");
  var getLocale = createConstantBridge("getLocale");
  var getSchemeUri = createConstantBridge("getSchemeUri");
  var getPlatformOS = createConstantBridge("getPlatformOS");
  var getOperationalEnvironment = createConstantBridge("getOperationalEnvironment");
  var getTossAppVersion = createConstantBridge("getTossAppVersion");
  var getDeviceId = createConstantBridge("getDeviceId");
  var contactsViral = createEventBridge("contactsViral");
  var startUpdateLocation = createEventBridge("startUpdateLocation");
  var onVisibilityChangedByTransparentServiceWeb = createEventBridge("onVisibilityChangedByTransparentServiceWeb");

  // node_modules/@apps-in-toss/types/dist/index.js
  var PermissionError = class extends Error {
    constructor({ methodName, message }) {
      super();
      this.name = `${methodName} permission error`;
      this.message = message;
    }
  };
  var FetchAlbumPhotosPermissionError = class extends PermissionError {
    constructor() {
      super({ methodName: "fetchAlbumPhotos", message: "\uC0AC\uC9C4\uCCA9 \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC5B4\uC694." });
    }
  };
  var FetchContactsPermissionError = class extends PermissionError {
    constructor() {
      super({ methodName: "fetchContacts", message: "\uC5F0\uB77D\uCC98 \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC5B4\uC694." });
    }
  };
  var OpenCameraPermissionError = class extends PermissionError {
    constructor() {
      super({ methodName: "openCamera", message: "\uCE74\uBA54\uB77C \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC5B4\uC694." });
    }
  };
  var GetCurrentLocationPermissionError = class extends PermissionError {
    constructor() {
      super({ methodName: "getCurrentLocation", message: "\uC704\uCE58 \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC5B4\uC694." });
    }
  };
  var StartUpdateLocationPermissionError = GetCurrentLocationPermissionError;
  var GetClipboardTextPermissionError = class extends PermissionError {
    constructor() {
      super({ methodName: "getClipboardText", message: "\uD074\uB9BD\uBCF4\uB4DC \uC77D\uAE30 \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC5B4\uC694." });
    }
  };
  var SetClipboardTextPermissionError = class extends PermissionError {
    constructor() {
      super({ methodName: "setClipboardText", message: "\uD074\uB9BD\uBCF4\uB4DC \uC4F0\uAE30 \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC5B4\uC694." });
    }
  };

  // node_modules/@apps-in-toss/web-bridge/built/index.js
  var Storage = {
    /**
     * @public
     * @category 저장소
     * @name getItem
     * @description 모바일 앱의 로컬 저장소에서 문자열 데이터를 가져와요. 주로 앱이 종료되었다가 다시 시작해도 데이터가 유지되어야 하는 경우에 사용해요.
     * @param {string} key - 가져올 아이템의 키를 입력해요.
     * @returns {Promise<string | null>} 지정한 키에 저장된 문자열 값을 반환해요. 값이 없으면 `null`을 반환해요.
     * @example
     *
     * ### `my-key`에 저장된 아이템 가져오기
     * ```ts
     * const value = await Storage.getItem('my-key');
     * console.log(value); // 'value'
     * ```
     */
    getItem: createAsyncBridge("getStorageItem"),
    /**
     * @public
     * @category 저장소
     * @name setItem
     * @description 모바일 앱의 로컬 저장소에 문자열 데이터를 저장해요. 주로 앱이 종료되었다가 다시 시작해도 데이터가 유지되어야 하는 경우에 사용해요.
     * @param {string} key - 저장할 아이템의 키를 입력해요.
     * @param {string} value - 저장할 아이템의 값을 입력해요.
     * @returns {Promise<void>} 아이템을 성공적으로 저장하면 아무 값도 반환하지 않아요.
     * @example
     *
     * ### `my-key`에 아이템 저장하기
     * ```ts
     * import { Storage } from '@apps-in-toss/framework';
     *
     * await Storage.setItem('my-key', 'value');
     * ```
     */
    setItem: createAsyncBridge("setStorageItem"),
    /**
     * @public
     * @category 저장소
     * @name removeItem
     * @description 모바일 앱의 로컬 저장소에서 특정 키에 해당하는 아이템을 삭제해요.
     * @param {string} key - 삭제할 아이템의 키를 입력해요.
     * @returns {Promise<void>} 아이템을 삭제하면 아무 값도 반환하지 않아요.
     * @example
     *
     * ### `my-key`에 저장된 아이템 삭제하기
     * ```ts
     * import { Storage } from '@apps-in-toss/framework';
     *
     * await Storage.removeItem('my-key');
     * ```
     */
    removeItem: createAsyncBridge("removeStorageItem"),
    /**
     * @public
     * @category 저장소
     * @name clearItems
     * @description 모바일 앱의 로컬 저장소의 모든 아이템을 삭제해요.
     * @returns {Promise<void>} 아이템을 삭제하면 아무 값도 반환하지 않고 저장소가 초기화돼요.
     * @example
     *
     * ### 저장소 초기화하기
     * ```ts
     * import { Storage } from '@apps-in-toss/framework';
     *
     * await Storage.clearItems();
     * ```
     */
    clearItems: createAsyncBridge("clearItems")
  };
  var SEMVER_REGEX = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\\-]+(?:\.[\da-z\\-]+)*))?(?:\+[\da-z\\-]+(?:\.[\da-z\\-]+)*)?)?)?$/i;
  var isWildcard = (val) => ["*", "x", "X"].includes(val);
  var tryParse = (val) => {
    const num = parseInt(val, 10);
    return isNaN(num) ? val : num;
  };
  var coerceTypes = (a, b) => {
    return typeof a === typeof b ? [a, b] : [String(a), String(b)];
  };
  var compareValues = (a, b) => {
    if (isWildcard(a) || isWildcard(b)) {
      return 0;
    }
    const [aVal, bVal] = coerceTypes(tryParse(a), tryParse(b));
    if (aVal > bVal) {
      return 1;
    }
    if (aVal < bVal) {
      return -1;
    }
    return 0;
  };
  var parseVersion = (version) => {
    if (typeof version !== "string") {
      throw new TypeError("Invalid argument: expected a string");
    }
    const match = version.match(SEMVER_REGEX);
    if (!match) {
      throw new Error(`Invalid semver: '${version}'`);
    }
    const [, major, minor, patch, build, preRelease] = match;
    return [major, minor, patch, build, preRelease];
  };
  var compareSegments = (a, b) => {
    const maxLength = Math.max(a.length, b.length);
    for (let i = 0; i < maxLength; i++) {
      const segA = a[i] ?? "0";
      const segB = b[i] ?? "0";
      const result = compareValues(segA, segB);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
  var compareVersions = (v1, v2) => {
    const seg1 = parseVersion(v1);
    const seg2 = parseVersion(v2);
    const preRelease1 = seg1.pop();
    const preRelease2 = seg2.pop();
    const mainCompare = compareSegments(seg1, seg2);
    if (mainCompare !== 0) {
      return mainCompare;
    }
    if (preRelease1 && preRelease2) {
      return compareSegments(preRelease1.split("."), preRelease2.split("."));
    }
    if (preRelease1) {
      return -1;
    }
    if (preRelease2) {
      return 1;
    }
    return 0;
  };
  function isMinVersionSupported(minVersions) {
    const operationalEnvironment = createConstantBridge("getOperationalEnvironment")();
    if (operationalEnvironment === "sandbox") {
      return true;
    }
    const currentVersion = createConstantBridge("getTossAppVersion")();
    const isIOS = createConstantBridge("getPlatformOS")() === "ios";
    const minVersion = isIOS ? minVersions.ios : minVersions.android;
    if (minVersion === void 0) {
      return false;
    }
    if (minVersion === "always") {
      return true;
    }
    if (minVersion === "never") {
      return false;
    }
    return compareVersions(currentVersion, minVersion) >= 0;
  }
  function processProductGrant(params) {
    return createAsyncBridge("processProductGrant")(params);
  }
  var IAP = {
    /**
     * @public
     * @category 인앱결제
     * @name createOneTimePurchaseOrder
     * @description
     * 특정 인앱결제 주문서 페이지로 이동해요. 사용자가 상품 구매 버튼을 누르는 상황 등에 사용할 수 있어요. 사용자의 결제는 이동한 페이지에서 진행돼요. 만약 결제 중에 에러가 발생하면 에러 유형에 따라 에러 페이지로 이동해요.
     * @param {IapCreateOneTimePurchaseOrderOptions} params - 인앱결제를 생성할 때 필요한 정보예요.
     * @returns {() => void} 앱브릿지 cleanup 함수를 반환해요. 인앱결제 기능이 끝나면 반드시 이 함수를 호출해서 리소스를 해제해야 해요.
     *
     * @throw {code: "INVALID_PRODUCT_ID"} - 유효하지 않은 상품 ID이거나, 해당 상품이 존재하지 않을 때 발생해요.
     * @throw {code: "PAYMENT_PENDING"} - 사용자가 요청한 결제가 아직 승인을 기다리고 있을 때 발생해요.
     * @throw {code: "NETWORK_ERROR"} - 서버 내부 문제로 요청을 처리할 수 없을 때 발생해요.
     * @throw {code: "INVALID_USER_ENVIRONMENT"} - 특정 기기, 계정 또는 설정 환경에서 구매할 수 없는 상품일 때 발생해요.
     * @throw {code: "ITEM_ALREADY_OWNED"} - 사용자가 이미 구매한 상품을 다시 구매하려고 할 때 발생해요.
     * @throw {code: "APP_MARKET_VERIFICATION_FAILED"} - 사용자가 결제를 완료했지만, 앱스토어에서 사용자 정보 검증에 실패했을 때 발생해요. 사용자가 앱스토어에 문의해서 환불을 요청해야해요.
     * @throw {code: "TOSS_SERVER_VERIFICATION_FAILED"} - 사용자가 결제를 완료했지만, 서버 전송에 실패해서 결제 정보를 저장할 수 없을 때 발생해요.
     * @throw {code: "INTERNAL_ERROR"} - 서버 내부 문제로 요청을 처리할 수 없을 때 발생해요.
     * @throw {code: "KOREAN_ACCOUNT_ONLY"} - iOS 환경에서 사용자의 계정이 한국 계정이 아닐 때 발생해요.
     * @throw {code: "USER_CANCELED"} - 사용자가 결제를 완료하지 않고 주문서 페이지를 이탈했을 때 발생해요.
     * @throw {code: "PRODUCT_NOT_GRANTED_BY_PARTNER"} - 파트너사의 상품 지급이 실패했을 때 발생해요.
     */
    createOneTimePurchaseOrder: (params) => {
      const isIAPSupported = isMinVersionSupported({
        android: "5.219.0",
        ios: "5.219.0"
      });
      const noop = () => {
      };
      if (!isIAPSupported) {
        return noop;
      }
      const isProcessProductGrantSupported = isMinVersionSupported({
        android: "5.231.1",
        ios: "5.230.0"
      });
      const { options, onEvent, onError } = params;
      const sku = options.sku ?? options.productId;
      if (!isProcessProductGrantSupported) {
        const v1 = () => {
          createAsyncBridge(
            "iapCreateOneTimePurchaseOrder"
          )({
            productId: sku
          }).then((response) => {
            Promise.resolve(options.processProductGrant({ orderId: response.orderId })).then(() => {
              onEvent({ type: "success", data: response });
            }).catch((error) => {
              onError(error);
            });
          }).catch((error) => {
            onError(error);
          });
          return noop;
        };
        return v1();
      }
      const unregisterCallbacks = createEventBridge("requestOneTimePurchase")({
        options: { sku },
        onEvent: async (event) => {
          if (event.type === "purchased") {
            const isProductGranted = await options.processProductGrant({ orderId: event.data.orderId });
            await processProductGrant({
              orderId: event.data.orderId,
              isProductGranted
            }).catch(onError);
          } else {
            onEvent(event);
          }
        },
        onError: (error) => {
          onError(error);
        }
      });
      return unregisterCallbacks;
    },
    /**
     * @public
     * @category 인앱결제
     * @name getProductItemList
     * @description 인앱결제로 구매할 수 있는 상품 목록을 가져와요. 상품 목록 화면에 진입할 때 호출해요.
     * @returns {Promise<{ products: IapProductListItem[] } | undefined>} 상품 목록을 포함한 객체를 반환해요. 앱 버전이 최소 지원 버전(안드로이드 5.219.0, iOS 5.219.0)보다 낮으면 `undefined`를 반환해요.
     */
    getProductItemList: createAsyncBridge("iapGetProductItemList"),
    /**
     * @public
     * @category 인앱결제
     * @name getPendingOrders
     * @description 대기 중인 주문 목록을 가져와요. 이 함수를 사용하면 결제가 아직 완료되지 않은 주문 정보를 확인할 수 있어요.
     * @returns {Promise<{orderIds: string[]}}>} 대기 중인 주문ID 배열을 반환해요. 앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 `undefined`를 반환해요.
     *
     * @example
     * ### 대기 중인 주문 목록 가져오기
     * ```typescript
     * import { IAP } from '@apps-in-toss/web-framework';
     *
     * async function fetchOrders() {
     *   try {
     *     const pendingOrders = await IAP.getPendingOrders();
     *     return pendingOrders;
     *   } catch (error) {
     *     console.error(error);
     *   }
     * }
     * ```
     */
    getPendingOrders: createAsyncBridge("getPendingOrders"),
    /**
     * @public
     * @category 인앱결제
     * @name getCompletedOrRefundedOrders
     * @description 인앱결제로 구매하거나 환불한 주문 목록을 가져와요.
     * @returns {Promise<CompletedOrRefundedOrdersResult>} 페이지네이션을 포함한 주문 목록 객체를 반환해요. 앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 `undefined`를 반환해요.
     *
     * @example
     * ```typescript
     * import { IAP } from "@apps-in-toss/web-framework";
     *
     * async function fetchOrders() {
     *   try {
     *     const response =  await IAP.getCompletedOrRefundedOrders();
     *     return response;
     *   } catch (error) {
     *     console.error(error);
     *   }
     * }
     * ```
     */
    getCompletedOrRefundedOrders: createAsyncBridge("getCompletedOrRefundedOrders"),
    /**
     * @public
     * @category 인앱결제
     * @name completeProductGrant
     * @description 상품 지급 처리를 완료했다는 메시지를 앱에 전달해요. 이 함수를 사용하면 결제가 완료된 주문의 상품 지급이 정상적으로 완료되었음을 알릴 수 있어요.
     * @param {{ params: { orderId: string } }} params 결제가 완료된 주문 정보를 담은 객체예요.
     * @param {string} params.orderId 주문의 고유 ID예요. 상품 지급을 완료할 주문을 지정할 때 사용해요.
     * @returns {Promise<boolean>} 상품 지급이 완료됐는지 여부를 반환해요. 앱 버전이 최소 지원 버전(안드로이드 5.233.0, iOS 5.233.0)보다 낮으면 `undefined`를 반환해요.
     *
     * @example
     * ### 결제를 성공한 뒤 상품을 지급하는 예시
     * ```typescript
     * import { IAP } from '@apps-in-toss/web-framework';
     *
     * async function handleGrantProduct(orderId: string) {
     *   try {
     *     await IAP.completeProductGrant({ params: { orderId } });
     *   } catch (error) {
     *     console.error(error);
     *   }
     * }
     * ```
     */
    completeProductGrant: createAsyncBridge("completeProductGrant")
  };
  var getSafeAreaBottom = createConstantBridge("getSafeAreaBottom");
  var getSafeAreaTop = createConstantBridge("getSafeAreaTop");
  var GoogleAdMob = {
    /**
     * @public
     * @category 광고
     * @name loadAdMobInterstitialAd
     * @deprecated 이 함수는 더 이상 사용되지 않습니다. 대신 {@link GoogleAdMob.loadAppsInTossAdMob}를 사용해주세요.
     *
     * @example
     * ### 뷰 진입 시 광고 불러오기 (loadAppsInTossAdMob로 변경 예제)
     * ```tsx
     * import { GoogleAdMob } from '@apps-in-toss/framework';
     * import { useEffect } from 'react';
     * import { View, Text } from 'react-native';
     *
     * const AD_GROUP_ID = '<AD_GROUP_ID>';
     *
     * function Page() {
     *   useEffect(() => {
     *     if (GoogleAdMob.loadAppsInTossAdMob.isSupported() !== true) {
     *       return;
     *     }
     *
     *     const cleanup = GoogleAdMob.loadAppsInTossAdMob({
     *       options: {
     *         adGroupId: AD_GROUP_ID,
     *       },
     *       onEvent: (event) => {
     *         switch (event.type) {
     *           case 'loaded':
     *             console.log('광고 로드 성공', event.data);
     *             break;
     *         }
     *       },
     *       onError: (error) => {
     *         console.error('광고 불러오기 실패', error);
     *       },
     *     });
     *
     *     return cleanup;
     *   }, []);
     *
     *   return (
     *     <View>
     *       <Text>Page</Text>
     *     </View>
     *   );
     * }
     * ```
     */
    loadAdMobInterstitialAd: Object.assign(
      createEventBridge("loadAdMobInterstitialAd"),
      {
        isSupported: createConstantBridge("loadAdMobInterstitialAd_isSupported")
      }
    ),
    /**
     * @public
     * @category 광고
     * @name showAdMobInterstitialAd
     * @deprecated 이 함수는 더 이상 사용되지 않습니다. 대신 {@link GoogleAdMob.showAppsInTossAdMob}를 사용해주세요.
     *
     * @example
     * ### 버튼 눌러 불러온 광고 보여주기 (showAppsInTossAdMob로 대체 사용)
     * ```tsx
     * import { GoogleAdMob } from '@apps-in-toss/framework';
     * import { View, Text, Button } from 'react-native';
     *
     * const AD_GROUP_ID = '<AD_GROUP_ID>';
     *
     * function Page() {
     *   const handlePress = () => {
     *     if (GoogleAdMob.showAppsInTossAdMob.isSupported() !== true) {
     *       return;
     *     }
     *
     *     GoogleAdMob.showAppsInTossAdMob({
     *       options: {
     *         adGroupId: AD_GROUP_ID,
     *       },
     *       onEvent: (event) => {
     *         switch (event.type) {
     *           case 'requested':
     *             console.log('광고 보여주기 요청 완료');
     *             break;
     *
     *           case 'clicked':
     *             console.log('광고 클릭');
     *             break;
     *
     *           case 'dismissed':
     *             console.log('광고 닫힘');
     *             navigation.navigate('/examples/google-admob-interstitial-ad-landing');
     *             break;
     *
     *           case 'failedToShow':
     *             console.log('광고 보여주기 실패');
     *             break;
     *
     *           case 'impression':
     *             console.log('광고 노출');
     *             break;
     *
     *           case 'userEarnedReward':
     *             console.log('광고 보상 획득 unitType:', event.data.unitType);
     *             console.log('광고 보상 획득 unitAmount:', event.data.unitAmount);
     *             break;
     *
     *           case 'show':
     *             console.log('광고 컨텐츠 보여졌음');
     *             break;
     *         }
     *       },
     *       onError: (error) => {
     *         console.error('광고 보여주기 실패', error);
     *       },
     *     });
     *   }
     *
     *   return (
     *     <Button onPress={handlePress} title="광고 보기" />
     *   );
     * }
     * ```
     */
    showAdMobInterstitialAd: Object.assign(
      createEventBridge("showAdMobInterstitialAd"),
      {
        isSupported: createConstantBridge("showAdMobInterstitialAd_isSupported")
      }
    ),
    /**
     * @public
     * @category 광고
     * @name loadAdMobRewardedAd
     * @deprecated 이 함수는 더 이상 사용되지 않습니다. 대신 {@link GoogleAdMob.loadAppsInTossAdMob}를 사용해주세요.
     *
     * @example
     * ### 뷰 진입 시 광고 불러오기 (loadAppsInTossAdMob로 변경 예제)
     * ```tsx
     * import { GoogleAdMob } from '@apps-in-toss/framework';
     * import { useEffect } from 'react';
     * import { View, Text } from 'react-native';
     *
     * const AD_GROUP_ID = '<AD_GROUP_ID>';
     *
     * function Page() {
     *   useEffect(() => {
     *     if (GoogleAdMob.loadAppsInTossAdMob.isSupported() !== true) {
     *       return;
     *     }
     *
     *     const cleanup = GoogleAdMob.loadAppsInTossAdMob({
     *       options: {
     *         adGroupId: AD_GROUP_ID,
     *       },
     *       onEvent: (event) => {
     *         switch (event.type) {
     *           case 'loaded':
     *             console.log('광고 로드 성공', event.data);
     *             break;
     *         }
     *       },
     *       onError: (error) => {
     *         console.error('광고 불러오기 실패', error);
     *       },
     *     });
     *
     *     return cleanup;
     *   }, []);
     *
     *   return (
     *     <View>
     *       <Text>Page</Text>
     *     </View>
     *   );
     * }
     * ```
     */
    loadAdMobRewardedAd: Object.assign(
      createEventBridge("loadAdMobRewardedAd"),
      {
        isSupported: createConstantBridge("loadAdMobRewardedAd_isSupported")
      }
    ),
    /**
     * @public
     * @category 광고
     * @name showAdMobRewardedAd
     * @deprecated 이 함수는 더 이상 사용되지 않습니다. 대신 {@link GoogleAdMob.showAppsInTossAdMob}를 사용해주세요.
     *
     * @example
     * ### 버튼 눌러 불러온 광고 보여주기 (showAppsInTossAdMob로 대체 사용)
     * ```tsx
     * import { GoogleAdMob } from '@apps-in-toss/framework';
     * import { View, Text, Button } from 'react-native';
     *
     * const AD_GROUP_ID = '<AD_GROUP_ID>';
     *
     * function Page() {
     *   const handlePress = () => {
     *     if (GoogleAdMob.showAppsInTossAdMob.isSupported() !== true) {
     *       return;
     *     }
     *
     *     GoogleAdMob.showAppsInTossAdMob({
     *       options: {
     *         adGroupId: AD_GROUP_ID,
     *       },
     *       onEvent: (event) => {
     *         switch (event.type) {
     *           case 'requested':
     *             console.log('광고 보여주기 요청 완료');
     *             break;
     *
     *           case 'clicked':
     *             console.log('광고 클릭');
     *             break;
     *
     *           case 'dismissed':
     *             console.log('광고 닫힘');
     *             navigation.navigate('/examples/google-admob-interstitial-ad-landing');
     *             break;
     *
     *           case 'failedToShow':
     *             console.log('광고 보여주기 실패');
     *             break;
     *
     *           case 'impression':
     *             console.log('광고 노출');
     *             break;
     *
     *           case 'userEarnedReward':
     *             console.log('광고 보상 획득 unitType:', event.data.unitType);
     *             console.log('광고 보상 획득 unitAmount:', event.data.unitAmount);
     *             break;
     *
     *           case 'show':
     *             console.log('광고 컨텐츠 보여졌음');
     *             break;
     *         }
     *       },
     *       onError: (error) => {
     *         console.error('광고 보여주기 실패', error);
     *       },
     *     });
     *   }
     *
     *   return (
     *     <Button onPress={handlePress} title="광고 보기" />
     *   );
     * }
     * ```
     */
    showAdMobRewardedAd: Object.assign(
      createEventBridge("showAdMobRewardedAd"),
      {
        isSupported: createConstantBridge("showAdMobRewardedAd_isSupported")
      }
    ),
    /**
     * @public
     * @category 광고
     * @name loadAppsInTossAdMob
     * @description 광고를 미리 불러와서, 광고가 필요한 시점에 바로 보여줄 수 있도록 준비하는 함수예요.
     * @param {LoadAdMobParams} params 광고를 불러올 때 사용할 설정 값이에요. 광고 그룹 ID와 광고의 동작에 대한 콜백을 설정할 수 있어요.
     * @param {LoadAdMobOptions} params.options 광고를 불러올 때 전달할 옵션 객체예요.
     * @param {string} params.options.adGroupId 광고 그룹 단위 ID예요. 콘솔에서 발급받은 ID를 입력해요.
     * @param {(event: LoadAdMobEvent) => void} [params.onEvent] 광고 관련 이벤트가 발생했을 때 호출돼요. (예시: 광고가 닫히거나 클릭됐을 때). 자세한 이벤트 타입은 [LoadAdMobEvent](/react-native/reference/native-modules/광고/LoadAdMobEvent.html)를 참고하세요.
     * @param {(reason: unknown) => void} [params.onError] 광고를 불러오지 못했을 때 호출돼요. (예시: 네트워크 오류나 지원하지 않는 환경일 때)
     * @property {() => boolean} [isSupported] 현재 실행 중인 앱(예: 토스 앱, 개발용 샌드박스 앱 등)에서 Google AdMob 광고 기능을 지원하는지 확인하는 함수예요. 기능을 사용하기 전에 지원 여부를 확인해야 해요.
     *
     * @example
     * ### 뷰 진입 시 광고 불러오기
     * ```tsx
     * import { GoogleAdMob } from '@apps-in-toss/framework';
     * import { useEffect } from 'react';
     * import { View, Text } from 'react-native';
     *
     * const AD_GROUP_ID = '<AD_GROUP_ID>';
     *
     * function Page() {
     *   useEffect(() => {
     *     if (GoogleAdMob.loadAppsInTossAdMob.isSupported() !== true) {
     *       return;
     *     }
     *
     *     const cleanup = GoogleAdMob.loadAppsInTossAdMob({
     *       options: {
     *         adGroupId: AD_GROUP_ID,
     *       },
     *       onEvent: (event) => {
     *         switch (event.type) {
     *           case 'loaded':
     *             console.log('광고 로드 성공', event.data);
     *             break;
     *         }
     *       },
     *       onError: (error) => {
     *         console.error('광고 불러오기 실패', error);
     *       },
     *     });
     *
     *     return cleanup;
     *   }, []);
     *
     *   return (
     *     <View>
     *       <Text>Page</Text>
     *     </View>
     *   );
     * }
     * ```
     */
    loadAppsInTossAdMob: Object.assign(createEventBridge("loadAppsInTossAdMob"), {
      isSupported: createConstantBridge("loadAppsInTossAdMob_isSupported")
    }),
    /**
     * @public
     * @category 광고
     * @name showAppsInTossAdMob
     * @description 광고를 사용자에게 노출해요. 이 함수는 `loadAppsInTossAdMob` 로 미리 불러온 광고를 실제로 사용자에게 노출해요.
     * @param {ShowAdMobParams} params 광고를 보여주기 위해 사용할 설정 값이에요. 광고 그룹 ID와과 광고의 동작에 대한 콜백을 설정할 수 있어요.
     * @param {ShowAdMobOptions} params.options 광고를 보여줄 때 전달할 옵션 객체예요.
     * @param {string} params.options.adUnitId 광고 그룹 단위 ID예요. `loadAppsInTossAdMob` 로 불러온 광고용 그룹 ID를 입력해요.
     * @param {(event: ShowAdMobEvent) => void} [params.onEvent] 광고 관련 이벤트가 발생했을 때 호출돼요. (예시: 광고 노출을 요청했을 때). 자세한 이벤트 타입은 [ShowAdMobEvent](/react-native/reference/native-modules/광고/ShowAdMobEvent.html)를 참고하세요.
     * @param {(reason: unknown) => void} [params.onError] 광고를 노출하지 못했을 때 호출돼요. (예시: 네트워크 오류나 지원하지 않는 환경일 때)
     * @property {() => boolean} [isSupported] 현재 실행 중인 앱(예: 토스 앱, 개발용 샌드박스 앱 등)에서 Google AdMob 광고 기능을 지원하는지 확인하는 함수예요. 기능을 사용하기 전에 지원 여부를 확인해야 해요.
     *
     * @example
     * ### 버튼 눌러 불러온 광고 보여주기
     * ```tsx
     * import { GoogleAdMob } from '@apps-in-toss/framework';
     * import { View, Text, Button } from 'react-native';
     *
     * const AD_GROUP_ID = '<AD_GROUP_ID>';
     *
     * function Page() {
     *   const handlePress = () => {
     *     if (GoogleAdMob.showAppsInTossAdMob.isSupported() !== true) {
     *       return;
     *     }
     *
     *     GoogleAdMob.showAppsInTossAdMob({
     *       options: {
     *         adGroupId: AD_GROUP_ID,
     *       },
     *       onEvent: (event) => {
     *         switch (event.type) {
     *           case 'requested':
     *             console.log('광고 보여주기 요청 완료');
     *             break;
     *
     *           case 'clicked':
     *             console.log('광고 클릭');
     *             break;
     *
     *           case 'dismissed':
     *             console.log('광고 닫힘');
     *             navigation.navigate('/examples/google-admob-interstitial-ad-landing');
     *             break;
     *
     *           case 'failedToShow':
     *             console.log('광고 보여주기 실패');
     *             break;
     *
     *           case 'impression':
     *             console.log('광고 노출');
     *             break;
     *
     *           case 'userEarnedReward':
     *             console.log('광고 보상 획득 unitType:', event.data.unitType);
     *             console.log('광고 보상 획득 unitAmount:', event.data.unitAmount);
     *             break;
     *
     *           case 'show':
     *             console.log('광고 컨텐츠 보여졌음');
     *             break;
     *         }
     *       },
     *       onError: (error) => {
     *         console.error('광고 보여주기 실패', error);
     *       },
     *     });
     *   }
     *
     *   return (
     *     <Button onPress={handlePress} title="광고 보기" />
     *   );
     * }
     * ```
     */
    showAppsInTossAdMob: Object.assign(createEventBridge("showAppsInTossAdMob"), {
      isSupported: createConstantBridge("showAppsInTossAdMob_isSupported")
    })
  };
  var env = {
    getDeploymentId: createConstantBridge("getDeploymentId")
  };
  var deploymentId = createConstantBridge("deploymentId");
  var brandDisplayName = createConstantBridge("brandDisplayName");
  var brandIcon = createConstantBridge("brandIcon");
  var brandPrimaryColor = createConstantBridge("brandPrimaryColor");
  var brandBridgeColorMode = createConstantBridge("brandBridgeColorMode");
  var partner = {
    /**
     * @public
     * @category 파트너
     * @name addAccessoryButton
     * @description 상단 네비게이션의 악세서리 버튼을 추가해요. callback에 대한 정의는 `tdsEvent.addEventListener("navigationAccessoryEvent", callback)`를 참고해주세요.
     * @param {AddAccessoryButtonOptions} options - 악세서리 버튼의 고유 ID예요.
     * @returns {void} 악세서리 버튼을 추가했을 때 아무 값도 반환하지 않아요.
     * @example
     * ```tsx
     * import { partner } from '@apps-in-toss/framework';
     *
     * partner.addAccessoryButton({
        id: 'init-heart',
        title: '하트',
        icon: {
          name: 'icon-heart-mono',
        },
      });
     * ```
     */
    addAccessoryButton: createAsyncBridge("addAccessoryButton"),
    /**
     * @public
     * @category 파트너
     * @name removeAccessoryButton
     * @description 상단 네비게이션의 악세서리 버튼을 제거해요.
     * @returns {void} 악세서리 버튼을 제거했을 때 아무 값도 반환하지 않아요.
     * @example
     * ```tsx
     * import { partner } from '@apps-in-toss/framework';
     *
     * partner.removeAccessoryButton();
     * ```
     */
    removeAccessoryButton: createAsyncBridge("removeAccessoryButton")
  };
  var requestPermission2 = createAsyncBridge("requestPermission");
  var getPermission2 = createAsyncBridge("getPermission");
  var openPermissionDialog2 = createAsyncBridge("openPermissionDialog");
  function createPermissionFunction({
    permission,
    handler,
    error
  }) {
    const permissionFunction = async (...args) => {
      const permissionStatus = await requestPermission2(permission);
      if (permissionStatus === "denied") {
        throw new error();
      }
      return handler(...args);
    };
    permissionFunction.getPermission = () => getPermission2(permission);
    permissionFunction.openPermissionDialog = () => openPermissionDialog2(permission);
    return permissionFunction;
  }
  var fetchAlbumPhotos2 = createPermissionFunction({
    handler: (options) => {
      return createAsyncBridge("fetchAlbumPhotos")(
        options
      );
    },
    permission: {
      name: "photos",
      access: "read"
    },
    error: FetchAlbumPhotosPermissionError
  });
  var fetchContacts2 = createPermissionFunction({
    handler: (options) => {
      return createAsyncBridge("fetchContacts")(options);
    },
    permission: {
      name: "contacts",
      access: "read"
    },
    error: FetchContactsPermissionError
  });
  var getCurrentLocation2 = createPermissionFunction({
    handler: (options) => {
      return createAsyncBridge(
        "getCurrentLocation"
      )(options);
    },
    permission: {
      name: "geolocation",
      access: "access"
    },
    error: GetCurrentLocationPermissionError
  });
  var openCamera2 = createPermissionFunction({
    handler: (options) => {
      return createAsyncBridge("openCamera")(options);
    },
    permission: {
      name: "camera",
      access: "access"
    },
    error: OpenCameraPermissionError
  });
  var setClipboardText2 = createPermissionFunction({
    handler: (options) => {
      return createAsyncBridge("setClipboardText")(
        options
      );
    },
    permission: {
      name: "clipboard",
      access: "write"
    },
    error: SetClipboardTextPermissionError
  });
  var getClipboardText2 = createPermissionFunction({
    handler: () => {
      return createAsyncBridge("getClipboardText")();
    },
    permission: {
      name: "clipboard",
      access: "read"
    },
    error: GetClipboardTextPermissionError
  });
  var getPermission22 = createAsyncBridge("getPermission");
  var openPermissionDialog22 = createAsyncBridge("openPermissionDialog");
  var startUpdateLocation2 = (params) => {
    return createEventBridge("updateLocationEvent")({
      ...params,
      onError: (error) => {
        const locationError = new StartUpdateLocationPermissionError();
        if (error instanceof Error && error.name === locationError.name) {
          return params.onError(locationError);
        }
        return params.onError(error);
      }
    });
  };
  startUpdateLocation2.getPermission = () => getPermission22({ name: "geolocation", access: "access" });
  startUpdateLocation2.openPermissionDialog = () => openPermissionDialog22({ name: "geolocation", access: "access" });

  // js/ad-adapter.js
  if (typeof window !== "undefined") {
    window.GoogleAdMob = GoogleAdMob;
    console.log("[AdAdapter] GoogleAdMob loaded via adapter.");
  }
})();
