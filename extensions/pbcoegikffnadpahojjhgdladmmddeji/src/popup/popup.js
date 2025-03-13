var DEFAULT_SETTINGS = {
        status: !0,
        blurryStartMode: !1,
        blurAmount: 25,
        blurImages: !0,
        blurVideos: !0,
        blurMale: !1,
        blurFemale: !0,
        specificBlur: !0,
        unblurImages: !1,
        unblurVideos: !1,
        gray: !0,
        strictness: 0.4,
        whitelist: [],
        detectionModel: "NhgGWcJyLYHMppbSpsfw",
        hideVideoToggle: !1,
    },
    settings = {},
    errorCount = 0,
    MAX_ERRORS = 3,
    ERROR_RESET_TIME = 6e4,
    clickCount = 0,
    lastClickTime = 0,
    CLICK_TIMEOUT = 1e3,
    REQUIRED_CLICKS = 3;
function initDeveloperMode() {
    const e = document.querySelector(".header h1");
    e &&
        e.addEventListener("click", (e) => {
            const t = Date.now();
            if (
                (t - lastClickTime > CLICK_TIMEOUT && (clickCount = 0),
                clickCount++,
                (lastClickTime = t),
                clickCount === REQUIRED_CLICKS)
            ) {
                const e = document.getElementById("model-selection"),
                    t = document.getElementById("model-selection-hr");
                e &&
                    t &&
                    (e.classList.remove("hidden"),
                    t.classList.remove("hidden")),
                    settings.hasOwnProperty("detectionModel")
                        ? safeUpdateElement(
                              "select[name=detectionModel]",
                              (e) => (e.value = settings.detectionModel)
                          )
                        : ((settings.detectionModel = "NhgGWcJyLYHMppbSpsfw"),
                          sendUpdatedSettings("detectionModel"));
            }
        });
}
safeUpdateElement(
    "select[name=detectionModel]",
    (e) => (e.value = settings.detectionModel ?? "NhgGWcJyLYHMppbSpsfw")
);
var currentWebsite,
    refreshMessage,
    container,
    refreshableSettings = Object.keys(DEFAULT_SETTINGS)?.filter(
        (e) => "status" !== e
    ),
    allSettings = [...refreshableSettings],
    initCalls = async () => {
        try {
            const e = navigator.language?.split("-")[0] ?? "en";
            setLanguage(settings.language ?? e),
                displaySettings(settings),
                addListeners(),
                initDeveloperMode();
        } catch (e) {
            handleError("Failed to initialize core functionality", e);
        }
    };
async function initPopup() {
    try {
        await loadLocalSettings(),
            "complete" === document.readyState ||
            "interactive" === document.readyState
                ? initCalls()
                : document.addEventListener("DOMContentLoaded", initCalls),
            await getCurrentWebsite(),
            displayWhiteList();
    } catch (e) {
        handleError("Failed to initialize popup", e),
            showErrorToUser(
                "Failed to initialize. Please try reopening the popup."
            );
    }
}
function loadLocalSettings() {
    return new Promise((e) => {
        chrome.storage.sync.get(["hb-settings"], function (t) {
            if (chrome.runtime.lastError) return (settings = {}), void e();
            (settings = t["hb-settings"]), e();
        });
    });
}
function getCurrentWebsite() {
    return new Promise((e) => {
        chrome.tabs?.query({ active: !0, currentWindow: !0 }, function (t) {
            if (t[0])
                try {
                    chrome.tabs.sendMessage(
                        t[0].id,
                        { type: "getCurrentWebsite" },
                        function (t) {
                            chrome.runtime.lastError
                                ? e(null)
                                : ((currentWebsite =
                                      t?.currentWebsite?.split("www.")?.[1] ??
                                      t?.currentWebsite ??
                                      null),
                                  e());
                        }
                    );
                } catch (t) {
                    e(null);
                }
            else e();
        });
    });
}
function safeUpdateElement(e, t) {
    const n = document.querySelector(e);
    if (n)
        try {
            t(n);
        } catch (t) {
            handleError(`Failed to update element: ${e}`, t);
        }
}
function displaySettings(e) {
    try {
        safeUpdateElement("input[name=status]", (t) => (t.checked = e.status)),
            safeUpdateElement(
                "input[name=blurryStartMode]",
                (t) => (t.checked = e.blurryStartMode)
            ),
            safeUpdateElement(
                "input[name=blurAmount]",
                (t) => (t.value = e.blurAmount)
            ),
            safeUpdateElement(
                "#blur-amount-value",
                (t) => (t.innerHTML = `${e.blurAmount}%`)
            ),
            safeUpdateElement(
                "input[name=gray]",
                (t) => (t.checked = e.gray ?? !0)
            ),
            safeUpdateElement(
                "input[name=strictness]",
                (t) => (t.value = +e.strictness)
            ),
            safeUpdateElement(
                "#strictness-value",
                (t) => (t.innerHTML = 100 * +e.strictness + "%")
            );
        document.querySelectorAll('input[name="specificBlur"]').forEach((t) => {
            t.checked = t.value === String(e.specificBlur);
        }),
            safeUpdateElement(
                "input[name=blurImages]",
                (t) => (t.checked = e.blurImages)
            ),
            safeUpdateElement(
                "input[name=blurVideos]",
                (t) => (t.checked = e.blurVideos)
            ),
            safeUpdateElement(
                "input[name=blurMale]",
                (t) => (t.checked = e.blurMale)
            ),
            safeUpdateElement(
                "input[name=blurFemale]",
                (t) => (t.checked = e.blurFemale)
            ),
            safeUpdateElement(
                "input[name=unblurImages]",
                (t) => (t.checked = e.unblurImages)
            ),
            safeUpdateElement(
                "input[name=unblurVideos]",
                (t) => (t.checked = e.unblurVideos)
            ),
            safeUpdateElement("#language", (t) => (t.value = e.language)),
            safeUpdateElement(
                "input[name=hideVideoToggle]",
                (t) => (t.checked = e.hideVideoToggle)
            ),
            (refreshMessage = document.querySelector("#refresh-message")),
            (container = document.querySelector("#container")),
            toggleAllInputs();
    } catch (e) {
        handleError("Failed to display settings", e);
    }
}
function addListeners() {
    try {
        const e = (e, t, n) => {
            const s = document.querySelector(e);
            s &&
                s.addEventListener(t, async (s) => {
                    try {
                        await n(s);
                    } catch (n) {
                        handleError(`Error in ${t} listener for ${e}`, n);
                    }
                });
        };
        e("input[name=status]", "change", updateStatus),
            e(
                "input[name=blurryStartMode]",
                "change",
                updateCheckbox("blurryStartMode")
            ),
            e("input[name=blurImages]", "change", updateCheckbox("blurImages")),
            e("input[name=blurVideos]", "change", updateCheckbox("blurVideos")),
            e("input[name=blurMale]", "change", updateCheckbox("blurMale")),
            e("input[name=blurFemale]", "change", updateCheckbox("blurFemale")),
            e("input[name=blurAmount]", "change", updateBlurAmount),
            e("input[name=gray]", "change", updateCheckbox("gray")),
            e("input[name=strictness]", "change", updateStrictness),
            document
                .querySelectorAll('input[name="specificBlur"]')
                .forEach((e) => {
                    e.addEventListener("change", updateSpecificBlur);
                }),
            e(
                "input[name=unblurImages]",
                "change",
                updateCheckbox("unblurImages")
            ),
            e(
                "input[name=unblurVideos]",
                "change",
                updateCheckbox("unblurVideos")
            ),
            e("#language", "change", function () {
                setLanguage(document.querySelector("#language").value);
            }),
            e("#whitelist", "change", updateWhitelist),
            e("select[name=detectionModel]", "change", function () {
                (settings.detectionModel = document.querySelector(
                    "select[name=detectionModel]"
                ).value),
                    sendUpdatedSettings("detectionModel"),
                    showRefreshMessage("detectionModel");
            }),
            e(
                "input[name=hideVideoToggle]",
                "change",
                updateCheckbox("hideVideoToggle")
            );
    } catch (e) {
        handleError("Failed to add listeners", e);
    }
}
async function updateSettingsInStorage() {
    let e = 0;
    for (; e < 3; )
        try {
            return (
                await chrome.storage.sync.set({ "hb-settings": settings }), !0
            );
        } catch (t) {
            if ((e++, 3 === e))
                return (
                    handleError("Failed to update settings in storage", t), !1
                );
            await new Promise((t) => setTimeout(t, 100 * e));
        }
}
async function sendUpdatedSettings(e) {
    try {
        chrome.storage.sync
            .set({ "hb-settings": settings })
            .then(() => {
                const t = {
                    type: "updateSettings",
                    newSetting: { key: e, value: settings[e] },
                };
                chrome.runtime.sendMessage(t, function (e) {
                    const { key: t, value: n } = e;
                    settings[t] = n;
                }),
                    chrome.tabs.query(
                        { currentWindow: !0, active: !0 },
                        function (e) {
                            const n = e[0];
                            n && chrome.tabs.sendMessage(n.id, t);
                        }
                    );
            })
            .catch((e) => {
                handleError("Failed to save settings to storage", e),
                    showErrorToUser(
                        "Failed to save settings. Please try again."
                    );
            });
    } catch (e) {
        handleError("Failed to send updated settings", e),
            showErrorToUser("Failed to save settings. Please try again.");
    }
}
function handleError(e, t) {
    ++errorCount >= MAX_ERRORS &&
        setTimeout(() => {
            errorCount = 0;
        }, ERROR_RESET_TIME);
}
function showErrorToUser(e) {
    const t = document.createElement("div");
    (t.style.cssText =
        "\n        position: fixed;\n        top: 10px;\n        left: 50%;\n        transform: translateX(-50%);\n        background-color: #ff4444;\n        color: white;\n        padding: 10px;\n        border-radius: 4px;\n        z-index: 1000;\n        text-align: center;\n    "),
        (t.textContent = e),
        document.body.appendChild(t),
        setTimeout(() => {
            t.remove();
        }, 3e3);
}
function displayWhiteList(e = !1) {
    try {
        const t = document.getElementById("whitelist-container"),
            n = document.getElementById("whitelist"),
            s = document.getElementById("website-name"),
            a = document.getElementById("whitelist-status-on"),
            r = document.getElementById("whitelist-status-off");
        if (!(t && n && s && a && r))
            throw new Error("Required whitelist elements not found");
        if (!currentWebsite) return void t.classList.add("hidden");
        t.classList.remove("hidden"),
            e ||
                ((s.innerHTML = currentWebsite),
                (n.checked = !settings.whitelist.includes(currentWebsite))),
            n.checked
                ? (a.classList.remove("hidden"), r.classList.add("hidden"))
                : (a.classList.add("hidden"), r.classList.remove("hidden"));
    } catch (e) {
        handleError("Failed to display whitelist", e);
    }
}
function updateStatus() {
    try {
        (settings.status =
            document.querySelector("input[name=status]").checked),
            toggleAllInputs(),
            sendUpdatedSettings("status"),
            showRefreshMessage("status");
    } catch (e) {
        handleError("Failed to update status", e);
        const t = document.querySelector("input[name=status]");
        t && (t.checked = !t.checked),
            showErrorToUser("Failed to update status. Please try again.");
    }
}
function updateBlurAmount() {
    try {
        const e = document.querySelector("input[name=blurAmount]");
        (settings.blurAmount = e.value),
            safeUpdateElement(
                "#blur-amount-value",
                (e) => (e.innerHTML = settings.blurAmount + "%")
            ),
            sendUpdatedSettings("blurAmount"),
            showRefreshMessage("blurAmount");
    } catch (e) {
        handleError("Failed to update blur amount", e);
    }
}
function updateStrictness() {
    try {
        (settings.strictness = document.querySelector(
            "input[name=strictness]"
        ).value),
            safeUpdateElement(
                "#strictness-value",
                (e) => (e.innerHTML = 100 * +settings.strictness + "%")
            ),
            sendUpdatedSettings("strictness"),
            showRefreshMessage("strictness");
    } catch (e) {
        handleError("Failed to update strictness", e);
    }
}
function updateCheckbox(e) {
    return function () {
        try {
            (settings[e] = document.querySelector(`input[name=${e}]`).checked),
                sendUpdatedSettings(e),
                showRefreshMessage(e);
        } catch (t) {
            handleError(`Failed to update checkbox: ${e}`, t);
        }
    };
}
function toggleAllInputs() {
    try {
        container && (container.style.opacity = settings.status ? 1 : 0.5),
            allSettings.forEach(function (e) {
                const t = document.querySelector(`input[name=${e}]`);
                t && (t.disabled = !settings.status);
            });
    } catch (e) {
        handleError("Failed to toggle inputs", e);
    }
}
function setLanguage(e) {
    try {
        if (!e || "string" != typeof e)
            throw new Error("Invalid language provided");
        document.body.lang = e;
        const t = document.getElementById("container");
        if (!t) throw new Error("Container element not found");
        t.dir = HB_TRANSLATIONS_DIR[e];
        const n = getTranslations(settings)?.[e];
        if (!n) throw new Error(`Translations not found for language: ${e}`);
        Object.keys(n).forEach((t) => {
            document.querySelectorAll(t).forEach((s) => {
                (s.innerHTML = n[t]),
                    HB_TRANSLATIONS_DIR[e] && (s.dir = HB_TRANSLATIONS_DIR[e]);
            });
        }),
            (settings.language = e),
            updateSettingsInStorage().catch((e) => {
                handleError("Failed to save language setting", e);
            });
    } catch (e) {
        handleError("Failed to set language", e),
            showErrorToUser("Failed to change language. Please try again.");
    }
}
function updateWhitelist(e) {
    try {
        if (!currentWebsite)
            throw new Error("No website selected for whitelist update");
        e.target.checked
            ? (settings.whitelist = settings.whitelist.filter(
                  (e) => e !== currentWebsite
              ))
            : (Array.isArray(settings.whitelist) || (settings.whitelist = []),
              settings.whitelist.push(currentWebsite)),
            sendUpdatedSettings("whitelist"),
            showRefreshMessage("whitelist"),
            displayWhiteList(!0);
    } catch (t) {
        handleError("Failed to update whitelist", t),
            showErrorToUser("Failed to update whitelist. Please try again."),
            (e.target.checked = !e.target.checked);
    }
}
function updateSpecificBlur() {
    try {
        const e = document.querySelector('input[name="specificBlur"]:checked'),
            t = settings.specificBlur;
        if (e && !settings.specificBlur) {
            if (
                !getTranslations(settings)?.[settings.language]?.[
                    "#specificBlurConfirm"
                ]
            )
                throw new Error(
                    "Translation not found for confirmation message"
                );
        }
        (settings.specificBlur = !!e && "true" === e.value),
            sendUpdatedSettings("specificBlur").catch((e) => {
                settings.specificBlur = t;
                throw (
                    (document
                        .querySelectorAll('input[name="specificBlur"]')
                        .forEach((e) => {
                            e.checked = e.value === String(t);
                        }),
                    e)
                );
            }),
            showRefreshMessage("specificBlur");
    } catch (e) {
        handleError("Failed to update specific blur setting", e),
            showErrorToUser("Failed to update blur setting. Please try again.");
    }
}
function showRefreshMessage(e) {
    refreshableSettings.includes(e) &&
        refreshMessage &&
        refreshMessage.classList.remove("hidden");
}
initPopup();
