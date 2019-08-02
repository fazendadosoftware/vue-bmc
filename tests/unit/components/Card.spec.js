import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Card from '@/components/Card.vue'

describe('Card.vue', () => {
  it('renders props.msg when passed', () => {
    const content = 'new message'
    const wrapper = mount(Card, {
      propsData: { content }
    })
    debugger
    console.log(`TEST _> ${wrapper.text()} <-`)
    expect(wrapper.text()).to.include(content)
  })
})
