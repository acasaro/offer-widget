import React from 'react';
import { shallow, mount } from 'enzyme';
import Modal from '../../../src/components/general/modal/modal';

describe('Modal Component', () => {
	it('should render a modal component', () => {
		const modal = shallow(<Modal handleClose={() => true} />);
		expect(modal).toMatchSnapshot();
	});

	it('should run componentWillUnmount on unmount', () => {
		const willUnmount = jest.fn();
		const testModal = mount(<Modal handleClose={() => true} />);
		testModal.instance().componentWillUnmount = willUnmount;
		testModal.unmount();
		expect(willUnmount.mock.calls.length).toBe(1);
	});

	it('should run handleClose prop function when accessibleKeys is triggered', () => {
		const mockHandleClose = jest.fn();
		const event = { key: 'Escape' };
		const modal = mount(<Modal handleClose={mockHandleClose} isOpen />);
		modal.instance().accessibleKeys(event);
		modal.unmount();
		expect(mockHandleClose.mock.calls.length).toBe(1);
	});

	it('should not run handleClose when the event passed to accessibleKeys is not Escape', () => {
		const mockHandleClose = jest.fn();
		const event = { key: 'Shift' };
		const modal = mount(<Modal handleClose={mockHandleClose} isOpen />);
		modal.instance().accessibleKeys(event);
		expect(mockHandleClose.mock.calls.length).toBe(0);
	});

	it('should set the focus back to the triggering element post-modal close', () => {
		const activeElem = document.createElement('button');
		document.body.appendChild(activeElem);

		activeElem.focus();

		const event = { key: 'Escape' };

		// document.activeElement should be changed here
		const testModal = mount(<Modal handleClose={() => true} />);

		testModal.setProps({ isOpen: true });

		testModal.instance().accessibleKeys({
			preventDefault: () => {},
			stopPropagation: () => {},
			key: 'Tab',
			target: testModal.instance().tabbables[0],
		});

		// ...and changed back to activeElem here
		testModal.instance().accessibleKeys(event);
		testModal.unmount();

		expect(document.activeElement).toBe(activeElem);
	});

	it('should get the tabbables within the modal when opened initially', () => {
		const testModal = mount(<Modal handleClose={() => true} />);
		expect(testModal.instance().tabbables).toHaveLength(0);
		testModal.setProps({ isOpen: true });

		// Modals have one tabbable by default (their close button)
		expect(testModal.instance().tabbables).toHaveLength(2);
	});

	it('should properly maintain tab order when in the modal, tabbing forward', () => {
		const tabForwardEvent = {
			key: 'Tab',
			preventDefault: () => {},
			stopPropagation: () => {},
		};

		const testModal = mount(
			<Modal handleClose={() => true}>
				<button id="link1">Link1</button>
				<button id="link2">Link2</button>
				<button id="link3">Link3</button>
			</Modal>
		);

		testModal.setProps({ isOpen: true });
		const tabbables = testModal.instance().tabbables;

		// For all but the last tabbable being focused, the tab key should take the user to the next tabbable
		for (let i = 0; i < tabbables.length - 1; i += 1) {
			testModal.instance().accessibleKeys({
				...tabForwardEvent,
				target: tabbables[i],
			});
			expect(document.activeElement).toEqual(tabbables[i + 1]);
		}

		// Test when the last tabbable is focused
		testModal.instance().accessibleKeys({
			...tabForwardEvent,
			target: tabbables[tabbables.length - 1],
		});
		expect(document.activeElement).toEqual(tabbables[0]);
	});

	it('should properly maintain tab order when in the modal, tabbing backward', () => {
		const tabBackEvent = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: () => {},
			stopPropagation: () => {},
		};

		const testModal = mount(
			<Modal handleClose={() => true}>
				<button id="link1">Link1</button>
				<button id="link2">Link2</button>
				<button id="link3">Link3</button>
			</Modal>
		);

		testModal.setProps({ isOpen: true });
		const tabbables = testModal.instance().tabbables;

		// For all but the first tabbable being focused, the tab key should take the user to the previous tabbable
		for (let i = tabbables.length - 1; i > 0; i -= 1) {
			testModal.instance().accessibleKeys({
				...tabBackEvent,
				target: tabbables[i],
			});
			expect(document.activeElement).toEqual(tabbables[i - 1]);
		}

		// Test when the first tabbable is focused
		testModal.instance().accessibleKeys({
			...tabBackEvent,
			target: tabbables[0],
		});
		expect(document.activeElement).toEqual(tabbables[tabbables.length - 1]);
	});
});
