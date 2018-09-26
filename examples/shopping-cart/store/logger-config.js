import createLogger from '../../../src/plugins/logger'
const extractModuleName = (mutationType) => {
  const index = mutationType.indexOf('/')
  if (index > -1) {
    return mutationType.slice(0, index)
  } else {
    return mutationType
  }
}

export default createLogger({
  collapsed: false, // expand mutations
  // ignore blacklisted mutations
  filter (mutation, stateBefore, stateAfter) {
    const blacklist = ['cart/setCheckoutStatus']
    return !blacklist.includes(mutation.type)
  },
  // omit cart from state if cart contains no objects
  transformer (state) {
    const { cart: currentCart } = state
    if (currentCart.items.length === 0) {
      const { cart, ...transformedState } = state
      return transformedState
    }
    return state
  },
  mutationTransformer (mutation) {
    // add an emoji to the mutation for some flare
    const emojis = {
      'cart': '🛒',
      'products': '🤤'
    }
    const { type, payload } = mutation
    const moduleName = extractModuleName(type)
    const emoji = emojis[moduleName]
    return `${emoji} ${type}, ${payload}`
  },
  logger: console
})
