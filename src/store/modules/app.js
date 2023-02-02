const app = {
  state: {
    form: {},
    flow: {}
  },

  mutations: {
    SET_FLOW: (state, flow) => {
      state.flow = flow;
    },
    SET_FORM: (state, form) => {
      state.form = form;
    }
  },

  actions: {
    // 保存流程图数据
    SaveFlowData({ dispatch, commit }, flowData) {
      return new Promise((resolve, reject) => {
        // save(flowData).catch(error => {
        //   reject(error);
        // });
      });
    }
  }
};

export default app;
