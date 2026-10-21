"use strict";
(self["webpackChunkremotion"] = self["webpackChunkremotion"] || []).push([["967"], {
4834(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  VideoMattingModal: () => (VideoMattingModal)
});
/* import */ var _index_pwxekqaw_mjs__rspack_import_0 = __webpack_require__(7525);
/* import */ var _index_7tt71e8n_mjs__rspack_import_1 = __webpack_require__(6429);
/* import */ var _index_8hzv0red_mjs__rspack_import_2 = __webpack_require__(4218);
/* import */ var _index_gfx254fk_mjs__rspack_import_3 = __webpack_require__(418);
/* import */ var _index_aze4bsk2_mjs__rspack_import_4 = __webpack_require__(4143);
/* import */ var _index_gkjcmb49_mjs__rspack_import_5 = __webpack_require__(8212);
/* import */ var _index_tysq66kh_mjs__rspack_import_6 = __webpack_require__(1543);
/* import */ var _index_twgd413y_mjs__rspack_import_7 = __webpack_require__(1216);
/* import */ var _index_4fks4h8y_mjs__rspack_import_8 = __webpack_require__(2238);
/* import */ var _index_hqxc6tzp_mjs__rspack_import_9 = __webpack_require__(1781);
/* import */ var _index_5h6bv8fh_mjs__rspack_import_10 = __webpack_require__(5716);
/* import */ var _index_g5wgr2gg_mjs__rspack_import_11 = __webpack_require__(3971);
/* import */ var _index_nm7e02ze_mjs__rspack_import_12 = __webpack_require__(649);
/* import */ var _index_8tk1xkcj_mjs__rspack_import_13 = __webpack_require__(2127);
/* import */ var _index_2yx78sh9_mjs__rspack_import_14 = __webpack_require__(9969);
/* import */ var _index_h02h76gq_mjs__rspack_import_15 = __webpack_require__(9070);
/* import */ var _index_7ygw7vg1_mjs__rspack_import_16 = __webpack_require__(8010);
/* import */ var _index_fady1kc0_mjs__rspack_import_17 = __webpack_require__(5384);
/* import */ var _index_rcv7qkt5_mjs__rspack_import_18 = __webpack_require__(2126);
/* import */ var _remotion_studio_shared__rspack_import_19 = __webpack_require__(3872);
Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* import */ var react__rspack_import_21 = __webpack_require__(6540);
/* import */ var react_jsx_runtime__rspack_import_22 = __webpack_require__(4848);





















// src/components/VideoMatting/VideoMattingModal.tsx




var MODELS = Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
var controlStyle = { width: 330, maxWidth: "100%" };
var panelStyle = {
  ..._index_2yx78sh9_mjs__rspack_import_14/* .optionsPanel */.Z6,
  flexDirection: "column",
  paddingTop: 16
};
var modalStyle = {
  ..._index_2yx78sh9_mjs__rspack_import_14/* .outerModalStyle */.uT,
  height: "auto",
  maxHeight: "calc(100vh - 40px)",
  minHeight: _index_2yx78sh9_mjs__rspack_import_14/* .outerModalStyle.height */.uT.height,
  outline: "none"
};
var modalLayout = {
  ..._index_2yx78sh9_mjs__rspack_import_14/* .horizontalLayout */.D6,
  flex: "1 1 auto"
};
var hiddenPanel = { display: "none" };
var validationStyle = { padding: "0 16px 8px" };
var makeOptions = ({
  items,
  selected,
  setSelected
}) => items.map(({ id, label: optionLabel }) => ({
  type: "item",
  id,
  value: id,
  label: optionLabel,
  leftItem: id === selected ? /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_twgd413y_mjs__rspack_import_7/* .Checkmark */.MG, {}) : null,
  keyHint: null,
  quickSwitcherLabel: null,
  subMenu: null,
  disabled: false,
  onClick: () => setSelected(id)
}));
var VideoMattingModal = ({
  displayName,
  src,
  target
}) => {
  const [tab, setTab] = (0,react__rspack_import_21.useState)("remove");
  const isModelCached = (0,react__rspack_import_21.useCallback)((selectedModel) => Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model: selectedModel }), []);
  const cachedModels = (0,_index_7tt71e8n_mjs__rspack_import_1/* .useModelCacheStatus */.X)({
    isModelCached,
    models: MODELS,
    refreshKey: tab
  });
  const baseName = (0,react__rspack_import_21.useMemo)(() => (0,_index_gfx254fk_mjs__rspack_import_3/* .getDefaultOutputBaseName */.Jjl)(src, displayName, "video"), [displayName, src]);
  const [outName, setOutName] = (0,react__rspack_import_21.useState)(`${baseName}-no-background.webm`);
  const [model, setModel] = (0,react__rspack_import_21.useState)("modnet");
  const [audio, setAudio] = (0,react__rspack_import_21.useState)("keep");
  const [videoBitrate, setVideoBitrate] = (0,react__rspack_import_21.useState)("very-high");
  const [support, setSupport] = (0,react__rspack_import_21.useState)({ type: "checking" });
  const staticFiles = (0,_index_gfx254fk_mjs__rspack_import_3/* .useStaticFiles */.JM3)();
  const { addVideoMattingJob, videoMattingJobs } = (0,react__rspack_import_21.useContext)(_index_hqxc6tzp_mjs__rspack_import_9/* .RenderQueueContext */.x7);
  const { setSelectedModal } = (0,react__rspack_import_21.useContext)(_index_twgd413y_mjs__rspack_import_7/* .SetSelectedModalContext */.Mq);
  const { setSidebarCollapsedState } = (0,react__rspack_import_21.useContext)(_index_gfx254fk_mjs__rspack_import_3/* .SidebarContext */.I0U);
  (0,react__rspack_import_21.useEffect)(() => {
    let cancelled = false;
    setSupport({ type: "checking" });
    Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model }).then((result) => {
      if (!cancelled) {
        setSupport(result.supported ? { type: "supported" } : { type: "unsupported", message: result.detailedReason });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [model]);
  const normalizedOutput = outName.normalize("NFC").toLowerCase();
  const queuedOutputs = new Set(videoMattingJobs.filter((job) => job.status === "idle" || job.status === "running" || job.status === "saving").map((job) => job.outName).map((name) => name.normalize("NFC").toLowerCase()));
  const outputError = (0,_index_gfx254fk_mjs__rspack_import_3/* .validatePublicOutputName */.MDu)({ extension: ".webm", outName }) ?? (queuedOutputs.has(normalizedOutput) ? "Another background removal job is using this output file" : null);
  const outputExists = staticFiles.some((file) => file.name.normalize("NFC").toLowerCase() === normalizedOutput);
  const canSubmit = support.type === "supported" && outputError === null;
  const modelOptions = (0,react__rspack_import_21.useMemo)(() => makeOptions({
    items: MODELS.map((item) => ({
      id: item.name,
      label: `${item.name} · ${(0,_remotion_studio_shared__rspack_import_19/* .formatBytes */.z3)(item.webGpuDownloadSize)}${cachedModels.has(item.name) ? " · Downloaded" : ""}`
    })),
    selected: model,
    setSelected: setModel
  }), [cachedModels, model]);
  const audioOptions = (0,react__rspack_import_21.useMemo)(() => makeOptions({
    items: [
      { id: "keep", label: "Keep original audio" },
      { id: "none", label: "No audio" }
    ],
    selected: audio,
    setSelected: setAudio
  }), [audio]);
  const qualityOptions = (0,react__rspack_import_21.useMemo)(() => makeOptions({
    items: ["very-low", "low", "medium", "high", "very-high"].map((id) => ({
      id,
      label: id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")
    })),
    selected: videoBitrate,
    setSelected: setVideoBitrate
  }), [videoBitrate]);
  const submit = (0,react__rspack_import_21.useCallback)(() => {
    if (!canSubmit)
      return;
    addVideoMattingJob({
      src,
      displayName,
      outName,
      model,
      audio,
      videoBitrate,
      target
    });
    setSidebarCollapsedState({ left: null, right: "expanded" });
    (0,_index_gfx254fk_mjs__rspack_import_3/* .persistSelectedOptionsSidebarPanel */.Gd8)("renders");
    _index_gfx254fk_mjs__rspack_import_3/* .optionsSidebarTabs.current */.nm0.current?.selectRendersPanel();
    setSelectedModal(null);
  }, [
    addVideoMattingJob,
    audio,
    canSubmit,
    displayName,
    outName,
    model,
    setSelectedModal,
    setSidebarCollapsedState,
    src,
    target,
    videoBitrate
  ]);
  const title = `Remove background from ${displayName}`;
  return /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .DismissableModal */.sbH, {
    ariaLabel: title,
    children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
      style: modalStyle,
      children: [
        /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .ModalHeader */.rQ0, {
          title
        }),
        /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
          style: _index_2yx78sh9_mjs__rspack_import_14/* .container */.kL,
          children: [
            /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
              style: _index_2yx78sh9_mjs__rspack_import_14/* .flexer */.lw
            }),
            /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_twgd413y_mjs__rspack_import_7/* .Button */.$n, {
              disabled: !canSubmit,
              onClick: submit,
              "aria-label": support.type === "unsupported" ? support.message : undefined,
              style: {
                ..._index_2yx78sh9_mjs__rspack_import_14/* .buttonStyle */.i9,
                backgroundColor: canSubmit ? _index_2yx78sh9_mjs__rspack_import_14/* .buttonStyle.backgroundColor */.i9.backgroundColor : _index_fady1kc0_mjs__rspack_import_17/* .BLUE_DISABLED */.er
              },
              children: "Remove background"
            })
          ]
        }),
        /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
          style: modalLayout,
          children: [
            /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
              style: _index_2yx78sh9_mjs__rspack_import_14/* .leftSidebar */.K8,
              children: [
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .VerticalTab */.sMJ, {
                  autoFocus: true,
                  onClick: () => setTab("remove"),
                  renderIcon: (color) => /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                    style: _index_2yx78sh9_mjs__rspack_import_14/* .iconContainer */.zc,
                    children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .GearIcon */.L64, {
                      color,
                      style: _index_2yx78sh9_mjs__rspack_import_14/* .icon */.Kk
                    })
                  }),
                  selected: tab === "remove",
                  style: _index_2yx78sh9_mjs__rspack_import_14/* .horizontalTab */.So,
                  children: "General"
                }),
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .VerticalTab */.sMJ, {
                  onClick: () => setTab("models"),
                  renderIcon: (color) => /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                    style: _index_2yx78sh9_mjs__rspack_import_14/* .iconContainer */.zc,
                    children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_2yx78sh9_mjs__rspack_import_14/* .ModelsIcon */.oi, {
                      color,
                      style: _index_2yx78sh9_mjs__rspack_import_14/* .icon */.Kk
                    })
                  }),
                  selected: tab === "models",
                  style: _index_2yx78sh9_mjs__rspack_import_14/* .horizontalTab */.So,
                  children: "Models"
                })
              ]
            }),
            /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
              style: tab === "remove" ? panelStyle : hiddenPanel,
              className: _index_h02h76gq_mjs__rspack_import_15/* .VERTICAL_SCROLLBAR_CLASSNAME */.uV,
              children: [
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_8hzv0red_mjs__rspack_import_2/* .RenderModalOutputName */.O, {
                  ariaLabel: "Video output file",
                  existingOutputPath: window.remotion_publicFolderExists ? `${window.remotion_publicFolderExists}/${outName}` : null,
                  existence: outputExists,
                  inputStyle: _index_gfx254fk_mjs__rspack_import_3/* .input */.hFB,
                  label: "Output in public/",
                  onValueChange: (event) => setOutName(event.target.value),
                  outName,
                  validationMessage: outputError
                }),
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .RenderModalHr */.YbN, {}),
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
                  style: _index_gfx254fk_mjs__rspack_import_3/* .optionRow */.wVt,
                  children: [
                    /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                      style: _index_gfx254fk_mjs__rspack_import_3/* .label */.Pfx,
                      children: "Model"
                    }),
                    /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                      style: _index_gfx254fk_mjs__rspack_import_3/* .rightRow */.jmp,
                      children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .Combobox */.G3_, {
                        values: modelOptions,
                        selectedId: model,
                        "aria-label": "Model",
                        style: controlStyle
                      })
                    })
                  ]
                }),
                support.type === "unsupported" ? /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                  style: validationStyle,
                  children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_2yx78sh9_mjs__rspack_import_14/* .ValidationMessage */.Xl, {
                    align: "flex-end",
                    message: support.message,
                    type: "error"
                  })
                }) : null,
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
                  style: _index_gfx254fk_mjs__rspack_import_3/* .optionRow */.wVt,
                  children: [
                    /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                      style: _index_gfx254fk_mjs__rspack_import_3/* .label */.Pfx,
                      children: "Audio"
                    }),
                    /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                      style: _index_gfx254fk_mjs__rspack_import_3/* .rightRow */.jmp,
                      children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .Combobox */.G3_, {
                        values: audioOptions,
                        selectedId: audio,
                        "aria-label": "Audio",
                        style: controlStyle
                      })
                    })
                  ]
                }),
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsxs)("div", {
                  style: _index_gfx254fk_mjs__rspack_import_3/* .optionRow */.wVt,
                  children: [
                    /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                      style: _index_gfx254fk_mjs__rspack_import_3/* .label */.Pfx,
                      children: "Video quality"
                    }),
                    /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)("div", {
                      style: _index_gfx254fk_mjs__rspack_import_3/* .rightRow */.jmp,
                      children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_gfx254fk_mjs__rspack_import_3/* .Combobox */.G3_, {
                        values: qualityOptions,
                        selectedId: String(videoBitrate),
                        "aria-label": "Video quality",
                        style: controlStyle
                      })
                    })
                  ]
                })
              ]
            }),
            /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_22.jsx)(_index_pwxekqaw_mjs__rspack_import_0/* .Models */.B, {
              description: `Models are downloaded automatically when needed.
You can also manage the browser cache here.`,
              indent: true,
              visible: tab === "models"
            })
          ]
        })
      ]
    })
  });
};



},
6429(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  X: () => (useModelCacheStatus)
});
/* import */ var react__rspack_import_0 = __webpack_require__(6540);
// src/components/use-model-cache-status.ts

var useModelCacheStatus = ({
  isModelCached,
  models,
  refreshKey
}) => {
  const [cachedModels, setCachedModels] = (0,react__rspack_import_0.useState)(new Set);
  (0,react__rspack_import_0.useEffect)(() => {
    let cancelled = false;
    Promise.all(models.map(async ({ name }) => ({
      cached: await isModelCached(name),
      name
    }))).then((results) => {
      if (!cancelled) {
        const nextCachedModels = new Set;
        for (const result of results) {
          if (result.cached) {
            nextCachedModels.add(result.name);
          }
        }
        setCachedModels(nextCachedModels);
      }
    }).catch(() => {
      if (!cancelled) {
        setCachedModels(new Set);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isModelCached, models, refreshKey]);
  return cachedModels;
};




},
2127(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  P: () => (ModelManager)
});
/* import */ var _index_2yx78sh9_mjs__rspack_import_0 = __webpack_require__(9969);
/* import */ var _index_h02h76gq_mjs__rspack_import_1 = __webpack_require__(9070);
/* import */ var _index_fady1kc0_mjs__rspack_import_2 = __webpack_require__(5384);
/* import */ var _remotion_studio_shared__rspack_import_3 = __webpack_require__(3872);
/* import */ var react__rspack_import_4 = __webpack_require__(6540);
/* import */ var react_jsx_runtime__rspack_import_5 = __webpack_require__(4848);




// src/components/ModelManager.tsx



var modelPanel = {
  ..._index_2yx78sh9_mjs__rspack_import_0/* .optionsPanel */.Z6,
  flexDirection: "column"
};
var hiddenPanel = { display: "none" };
var container = {
  boxSizing: "border-box",
  flex: 1,
  fontFamily: "sans-serif",
  minWidth: 0,
  padding: "16px 16px 0",
  width: "100%"
};
var flushContainer = {
  ...container,
  padding: "16px 0 0"
};
var descriptionStyle = {
  color: _index_fady1kc0_mjs__rspack_import_2/* .LIGHT_TEXT */.hf,
  fontSize: 13,
  lineHeight: 1.5,
  margin: 0,
  whiteSpace: "pre-line"
};
var list = { marginTop: 14 };
var modelRow = {
  alignItems: "center",
  display: "flex",
  gap: 10,
  minHeight: 38
};
var modelIcon = {
  flexShrink: 0,
  height: 16,
  width: 16
};
var statusIcon = {
  flexShrink: 0,
  height: 14,
  width: 14
};
var modelName = {
  color: _index_fady1kc0_mjs__rspack_import_2/* .LIGHT_TEXT */.hf,
  flex: 1,
  fontFamily: "monospace",
  fontSize: 13,
  lineHeight: 1.4,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};
var status = {
  color: _index_fady1kc0_mjs__rspack_import_2/* .LIGHT_TEXT */.hf,
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1.4,
  whiteSpace: "nowrap"
};
var actionIcon = { height: 14, width: 14 };
var actionSlot = {
  alignItems: "center",
  display: "inline-flex",
  flexShrink: 0,
  height: 24,
  justifyContent: "center",
  width: 24
};
var ModelManager = ({
  ariaLabel,
  availableModels,
  description,
  indent,
  isModelCached,
  loadModel,
  prepare,
  removeModel,
  visible
}) => {
  const mounted = (0,react__rspack_import_4.useRef)(true);
  const initialized = (0,react__rspack_import_4.useRef)(false);
  const [cachedModels, setCachedModels] = (0,react__rspack_import_4.useState)(null);
  const [actionState, setActionState] = (0,react__rspack_import_4.useState)({
    type: "idle"
  });
  const [cacheCheckError, setCacheCheckError] = (0,react__rspack_import_4.useState)(null);
  (0,react__rspack_import_4.useEffect)(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  (0,react__rspack_import_4.useEffect)(() => {
    if (!visible || initialized.current) {
      return;
    }
    initialized.current = true;
    Promise.resolve().then(() => prepare?.()).then(() => Promise.all(availableModels.map(async ({ name }) => await isModelCached(name) ? name : null))).then((models) => {
      if (mounted.current) {
        const cached = new Set;
        for (const model of models) {
          if (model !== null) {
            cached.add(model);
          }
        }
        setCachedModels(cached);
      }
    }).catch((error) => {
      if (mounted.current) {
        setCachedModels(new Set);
        setCacheCheckError(error instanceof Error ? error.message : String(error));
      }
    });
  }, [availableModels, isModelCached, prepare, visible]);
  const downloadModel = (0,react__rspack_import_4.useCallback)((model) => {
    setActionState({ type: "downloading", model, progress: 0 });
    loadModel(model, (progress) => {
      if (mounted.current) {
        setActionState({ type: "downloading", model, progress });
      }
    }).then(() => {
      if (mounted.current) {
        setCachedModels((current) => new Set([...current ?? [], model]));
        setActionState({ type: "idle" });
      }
    }).catch((error) => {
      if (mounted.current) {
        setActionState({
          type: "error",
          model,
          message: error instanceof Error ? error.message : String(error)
        });
      }
    });
  }, [loadModel]);
  const remove = (0,react__rspack_import_4.useCallback)((model) => {
    setActionState({ type: "removing", model });
    removeModel(model).then(() => {
      if (mounted.current) {
        setCachedModels((current) => {
          const next = new Set(current ?? []);
          next.delete(model);
          return next;
        });
        setActionState({ type: "idle" });
      }
    }).catch((error) => {
      if (mounted.current) {
        setActionState({
          type: "error",
          model,
          message: error instanceof Error ? error.message : String(error)
        });
      }
    });
  }, [removeModel]);
  const renderDownloadIcon = (0,react__rspack_import_4.useCallback)((color) => {
    return /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .CloudDownloadIcon */.$w, {
      color,
      style: actionIcon
    });
  }, []);
  const renderRemoveIcon = (0,react__rspack_import_4.useCallback)((color) => {
    return /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .TrashIcon */.uc, {
      color,
      style: actionIcon
    });
  }, []);
  const actionInProgress = actionState.type === "downloading" || actionState.type === "removing";
  return /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)("div", {
    style: visible ? modelPanel : hiddenPanel,
    className: _index_h02h76gq_mjs__rspack_import_1/* .VERTICAL_SCROLLBAR_CLASSNAME */.uV,
    children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsxs)("div", {
      style: indent ? container : flushContainer,
      children: [
        description === null ? null : /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)("p", {
          style: descriptionStyle,
          children: description
        }),
        cacheCheckError ? /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .ValidationMessage */.Xl, {
          align: "flex-start",
          message: cacheCheckError,
          type: "error"
        }) : null,
        /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)("div", {
          style: description === null ? undefined : list,
          role: "list",
          "aria-label": ariaLabel,
          children: availableModels.map((model) => {
            const cached = cachedModels?.has(model.name) ?? false;
            const processingThisModel = actionState.type !== "idle" && actionState.type !== "error" && actionState.model === model.name;
            const progress = actionState.type === "downloading" && actionState.model === model.name ? actionState.progress : null;
            const modelStatus = processingThisModel ? actionState.type === "removing" ? "Removing…" : `Downloading${progress === null ? "…" : ` ${Math.round(progress * 100)}%`}` : actionState.type === "error" && actionState.model === model.name ? actionState.message : (0,_remotion_studio_shared__rspack_import_3/* .formatBytes */.z3)(model.webGpuDownloadSize);
            return /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsxs)("div", {
              role: "listitem",
              style: modelRow,
              children: [
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .ModelsIcon */.oi, {
                  "aria-hidden": true,
                  color: _index_fady1kc0_mjs__rspack_import_2/* .LIGHT_TEXT */.hf,
                  style: modelIcon
                }),
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)("span", {
                  style: modelName,
                  children: model.name
                }),
                /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)("span", {
                  role: "group",
                  style: status,
                  "aria-label": modelStatus,
                  children: modelStatus
                }),
                cached ? /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .CheckCircleFilled */.Pk, {
                  "aria-hidden": true,
                  style: { ...statusIcon, fill: _index_fady1kc0_mjs__rspack_import_2/* .BLUE */.ft }
                }) : null,
                processingThisModel ? /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)("span", {
                  style: actionSlot,
                  children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .Spinner */.y$, {
                    duration: 0.5,
                    size: 14
                  })
                }) : cached ? /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_h02h76gq_mjs__rspack_import_1/* .ActionTooltip */.mT, {
                  label: "Uninstall",
                  shortcut: null,
                  delay: 800,
                  dismissOnClick: true,
                  children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .InlineAction */.gs, {
                    "aria-label": `Remove ${model.name}`,
                    disabled: actionInProgress,
                    onClick: () => remove(model.name),
                    renderAction: renderRemoveIcon,
                    variant: null
                  })
                }) : /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_h02h76gq_mjs__rspack_import_1/* .ActionTooltip */.mT, {
                  label: "Install",
                  shortcut: null,
                  delay: 800,
                  dismissOnClick: true,
                  children: /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_5.jsx)(_index_2yx78sh9_mjs__rspack_import_0/* .InlineAction */.gs, {
                    "aria-label": `Download ${model.name}`,
                    disabled: cachedModels === null || actionInProgress,
                    onClick: () => downloadModel(model.name),
                    renderAction: renderDownloadIcon,
                    variant: null
                  })
                })
              ]
            }, model.name);
          })
        })
      ]
    })
  });
};




},
7525(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  B: () => (Models)
});
/* import */ var _index_8tk1xkcj_mjs__rspack_import_0 = __webpack_require__(2127);
Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* import */ var react__rspack_import_2 = __webpack_require__(6540);
/* import */ var react_jsx_runtime__rspack_import_3 = __webpack_require__(4848);


// src/components/VideoMatting/Models.tsx



var AVAILABLE_MODELS = Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
var Models = ({ description, indent, visible }) => {
  const isModelCached = (0,react__rspack_import_2.useCallback)((model) => Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model }), []);
  const loadModel = (0,react__rspack_import_2.useCallback)((model, onProgress) => Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
    model,
    onProgress: (progress) => onProgress(progress.progress)
  }), []);
  const removeModel = (0,react__rspack_import_2.useCallback)((model) => Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model }), []);
  return /* @__PURE__ */ (0,react_jsx_runtime__rspack_import_3.jsx)(_index_8tk1xkcj_mjs__rspack_import_0/* .ModelManager */.P, {
    ariaLabel: "Video matting models",
    availableModels: AVAILABLE_MODELS,
    description,
    indent,
    isModelCached,
    loadModel,
    prepare: null,
    removeModel,
    visible
  });
};




},

}]);
//# sourceMappingURL=967.bundle.js.map