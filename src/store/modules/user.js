export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    channelId: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateChannelId (state, channelId) {
      state.channelId = channelId
    }
  }
}
