const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Select = require('../');
const Option = Select.Option;
const $ = require('jquery');

describe('Select', () => {
  let instance;
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('render to body works', (done) => {
    instance = ReactDOM.render(
      <Select
        value="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupDOMNode().parentNode.parentNode.nodeName.toLowerCase()).to.be('body');
      expect(instance.getPopupDOMNode().className).not.to.contain('hidden');
      done();
    });
  });

  it('should add css class of root dom node', () => {
    instance = ReactDOM.render(
      <Select className="forTest" openClassName="my-open" value="2">
        <Option value="1">1</Option>
        <Option value="2" disabled>2</Option>
      </Select>, div);
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should default select the right option', (done) => {
    instance = ReactDOM.render(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupMenuComponent().instanceArray[0].props.selected).to.be(false);
      expect(instance.getPopupMenuComponent().instanceArray[1].props.selected).to.be(true);
      done();
    });
  });

  it('should can select multiple items', (done) => {
    instance = ReactDOM.render(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>, div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupMenuComponent().instanceArray[0].props.selected).to.be(true);
      expect(instance.getPopupMenuComponent().instanceArray[1].props.selected).to.be(true);
      expect(instance.getPopupMenuComponent().instanceArray[2].props.selected).to.be(false);
      done();
    });
  });

  it('should have clear button', () => {
    instance = ReactDOM.render(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'rc-select-selection__clear').length).to.be(1);
  });

  it.only('should not response click event when select is disabled', (done) => {
    instance = ReactDOM.render(
      <Select disabled defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
    console.log(instance.state);
    expect(instance.state.open).to.be(undefined);
    done();
  });

  describe('when open', function test() {
    this.timeout(400000);

    beforeEach((done) => {
      div = document.createElement('div');
      div.tabIndex = 0;
      document.body.appendChild(div);
      instance = ReactDOM.render(
        <Select>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        div);
      Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
      done();
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should show not found', (done) => {
      instance.getInputDOMNode().value = '4';
      Simulate.change(instance.getInputDOMNode());
      setTimeout(() => {
        expect($(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(1);
        expect($(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item')[0].innerHTML).to.be('Not Found');
        done();
      }, 100);
    });
  });
});
