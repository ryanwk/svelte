
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/ContactCard.svelte generated by Svelte v3.29.4 */

    const file = "src/ContactCard.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let header;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let h2;
    	let t4;
    	let div2;
    	let p;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			header = element("header");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "User Name";
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Job Title";
    			t4 = space();
    			div2 = element("div");
    			p = element("p");
    			p.textContent = "A short description";
    			if (img.src !== (img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-10kp4ar");
    			add_location(img, file, 55, 23, 856);
    			attr_dev(div0, "class", "thumb svelte-10kp4ar");
    			add_location(div0, file, 55, 4, 837);
    			attr_dev(h1, "class", "svelte-10kp4ar");
    			add_location(h1, file, 57, 6, 918);
    			attr_dev(h2, "class", "svelte-10kp4ar");
    			add_location(h2, file, 58, 6, 943);
    			attr_dev(div1, "class", "user-data svelte-10kp4ar");
    			add_location(div1, file, 56, 4, 888);
    			attr_dev(header, "class", "svelte-10kp4ar");
    			add_location(header, file, 54, 2, 824);
    			add_location(p, file, 62, 4, 1017);
    			attr_dev(div2, "class", "description svelte-10kp4ar");
    			add_location(div2, file, 61, 2, 987);
    			attr_dev(div3, "class", "contact-card svelte-10kp4ar");
    			add_location(div3, file, 53, 0, 795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, header);
    			append_dev(header, div0);
    			append_dev(div0, img);
    			append_dev(header, t0);
    			append_dev(header, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ContactCard", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ContactCard> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ContactCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactCard",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/CourseGoal.svelte generated by Svelte v3.29.4 */

    const file$1 = "src/CourseGoal.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let header;
    	let div0;
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");
    			div0 = element("div");
    			h1 = element("h1");
    			t = text(/*courseGoal*/ ctx[0]);
    			attr_dev(h1, "class", "svelte-178ja1");
    			add_location(h1, file$1, 41, 6, 798);
    			attr_dev(div0, "class", "user-data svelte-178ja1");
    			toggle_class(div0, "red", /*courseGoal*/ ctx[0].includes("!"));
    			add_location(div0, file$1, 39, 4, 596);
    			attr_dev(header, "class", "svelte-178ja1");
    			add_location(header, file$1, 38, 2, 583);
    			attr_dev(div1, "class", "course-goal svelte-178ja1");
    			add_location(div1, file$1, 37, 0, 555);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			append_dev(header, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*courseGoal*/ 1) set_data_dev(t, /*courseGoal*/ ctx[0]);

    			if (dirty & /*courseGoal*/ 1) {
    				toggle_class(div0, "red", /*courseGoal*/ ctx[0].includes("!"));
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CourseGoal", slots, []);
    	let { courseGoal } = $$props;
    	const writable_props = ["courseGoal"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CourseGoal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("courseGoal" in $$props) $$invalidate(0, courseGoal = $$props.courseGoal);
    	};

    	$$self.$capture_state = () => ({ courseGoal });

    	$$self.$inject_state = $$props => {
    		if ("courseGoal" in $$props) $$invalidate(0, courseGoal = $$props.courseGoal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [courseGoal];
    }

    class CourseGoal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { courseGoal: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CourseGoal",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*courseGoal*/ ctx[0] === undefined && !("courseGoal" in props)) {
    			console.warn("<CourseGoal> was created without expected prop 'courseGoal'");
    		}
    	}

    	get courseGoal() {
    		throw new Error("<CourseGoal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set courseGoal(value) {
    		throw new Error("<CourseGoal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.29.4 */

    const { console: console_1 } = globals;
    const file$2 = "src/App.svelte";

    function create_fragment$2(ctx) {
    	let h10;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let t7;
    	let input0;
    	let t8;
    	let input1;
    	let t9;
    	let input2;
    	let t10;
    	let textarea;
    	let t11;
    	let contactcard;
    	let t12;
    	let h11;
    	let t14;
    	let p;
    	let t16;
    	let ol;
    	let li0;
    	let t18;
    	let li1;
    	let t20;
    	let li2;
    	let t22;
    	let li3;
    	let t24;
    	let input3;
    	let t25;
    	let coursegoal;
    	let current;
    	let mounted;
    	let dispose;

    	contactcard = new ContactCard({
    			props: {
    				userName: /*name*/ ctx[1],
    				jobTitle: /*title*/ ctx[2],
    				description: /*description*/ ctx[4],
    				userImage: /*image*/ ctx[3]
    			},
    			$$inline: true
    		});

    	coursegoal = new CourseGoal({
    			props: { courseGoal: /*goal*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			t0 = text("Hello ");
    			t1 = text(/*uppercaseName*/ ctx[6]);
    			t2 = text(", my age is ");
    			t3 = text(/*age*/ ctx[5]);
    			t4 = text("!");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Change Age";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			textarea = element("textarea");
    			t11 = space();
    			create_component(contactcard.$$.fragment);
    			t12 = space();
    			h11 = element("h1");
    			h11.textContent = "Assignment";
    			t14 = space();
    			p = element("p");
    			p.textContent = "Solve these tasks.";
    			t16 = space();
    			ol = element("ol");
    			li0 = element("li");
    			li0.textContent = "Add an input field that allows users to enter a course goal.";
    			t18 = space();
    			li1 = element("li");
    			li1.textContent = "Output the user input in a h1 tag.";
    			t20 = space();
    			li2 = element("li");
    			li2.textContent = "Color the output red (e.g. by adding a class) if it contains at least one\n    exclamation mark.";
    			t22 = space();
    			li3 = element("li");
    			li3.textContent = "Put the h1 tag + output into a separate component to which you pass the user\n    input";
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			create_component(coursegoal.$$.fragment);
    			attr_dev(h10, "class", "svelte-1ucbz36");
    			add_location(h10, file$2, 42, 0, 693);
    			add_location(button, file$2, 43, 0, 742);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 46, 0, 921);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 47, 0, 961);
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$2, 48, 0, 1002);
    			attr_dev(textarea, "rows", "3");
    			add_location(textarea, file$2, 49, 0, 1043);
    			attr_dev(h11, "class", "svelte-1ucbz36");
    			add_location(h11, file$2, 53, 0, 1173);
    			add_location(p, file$2, 55, 0, 1194);
    			add_location(li0, file$2, 58, 2, 1228);
    			add_location(li1, file$2, 59, 2, 1300);
    			add_location(li2, file$2, 60, 2, 1346);
    			add_location(li3, file$2, 64, 2, 1461);
    			add_location(ol, file$2, 57, 0, 1221);
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$2, 70, 0, 1572);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			append_dev(h10, t0);
    			append_dev(h10, t1);
    			append_dev(h10, t2);
    			append_dev(h10, t3);
    			append_dev(h10, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*name*/ ctx[1]);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*title*/ ctx[2]);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*image*/ ctx[3]);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*description*/ ctx[4]);
    			insert_dev(target, t11, anchor);
    			mount_component(contactcard, target, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, h11, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, ol, anchor);
    			append_dev(ol, li0);
    			append_dev(ol, t18);
    			append_dev(ol, li1);
    			append_dev(ol, t20);
    			append_dev(ol, li2);
    			append_dev(ol, t22);
    			append_dev(ol, li3);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, input3, anchor);
    			set_input_value(input3, /*goal*/ ctx[0]);
    			insert_dev(target, t25, anchor);
    			mount_component(coursegoal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*incrementAge*/ ctx[7], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[10]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*uppercaseName*/ 64) set_data_dev(t1, /*uppercaseName*/ ctx[6]);
    			if (!current || dirty & /*age*/ 32) set_data_dev(t3, /*age*/ ctx[5]);

    			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			if (dirty & /*title*/ 4 && input1.value !== /*title*/ ctx[2]) {
    				set_input_value(input1, /*title*/ ctx[2]);
    			}

    			if (dirty & /*image*/ 8 && input2.value !== /*image*/ ctx[3]) {
    				set_input_value(input2, /*image*/ ctx[3]);
    			}

    			if (dirty & /*description*/ 16) {
    				set_input_value(textarea, /*description*/ ctx[4]);
    			}

    			const contactcard_changes = {};
    			if (dirty & /*name*/ 2) contactcard_changes.userName = /*name*/ ctx[1];
    			if (dirty & /*title*/ 4) contactcard_changes.jobTitle = /*title*/ ctx[2];
    			if (dirty & /*description*/ 16) contactcard_changes.description = /*description*/ ctx[4];
    			if (dirty & /*image*/ 8) contactcard_changes.userImage = /*image*/ ctx[3];
    			contactcard.$set(contactcard_changes);

    			if (dirty & /*goal*/ 1 && input3.value !== /*goal*/ ctx[0]) {
    				set_input_value(input3, /*goal*/ ctx[0]);
    			}

    			const coursegoal_changes = {};
    			if (dirty & /*goal*/ 1) coursegoal_changes.courseGoal = /*goal*/ ctx[0];
    			coursegoal.$set(coursegoal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactcard.$$.fragment, local);
    			transition_in(coursegoal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactcard.$$.fragment, local);
    			transition_out(coursegoal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(t11);
    			destroy_component(contactcard, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(h11);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(ol);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(input3);
    			if (detaching) detach_dev(t25);
    			destroy_component(coursegoal, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let goal = "input course goal";
    	let name = "Max";
    	let title = "";
    	let image = "";
    	let description = "";
    	let age = 30;

    	function incrementAge() {
    		$$invalidate(5, age += 1);
    	}

    	function changeName() {
    		$$invalidate(1, name = "Maximilian");
    	}

    	function nameInput(event) {
    		const enteredValue = event.target.value;
    		$$invalidate(1, name = enteredValue);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function input1_input_handler() {
    		title = this.value;
    		$$invalidate(2, title);
    	}

    	function input2_input_handler() {
    		image = this.value;
    		$$invalidate(3, image);
    	}

    	function textarea_input_handler() {
    		description = this.value;
    		$$invalidate(4, description);
    	}

    	function input3_input_handler() {
    		goal = this.value;
    		$$invalidate(0, goal);
    	}

    	$$self.$capture_state = () => ({
    		ContactCard,
    		CourseGoal,
    		goal,
    		name,
    		title,
    		image,
    		description,
    		age,
    		incrementAge,
    		changeName,
    		nameInput,
    		uppercaseName
    	});

    	$$self.$inject_state = $$props => {
    		if ("goal" in $$props) $$invalidate(0, goal = $$props.goal);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("image" in $$props) $$invalidate(3, image = $$props.image);
    		if ("description" in $$props) $$invalidate(4, description = $$props.description);
    		if ("age" in $$props) $$invalidate(5, age = $$props.age);
    		if ("uppercaseName" in $$props) $$invalidate(6, uppercaseName = $$props.uppercaseName);
    	};

    	let uppercaseName;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 2) {
    			// let uppercaseName; not required!
    			 $$invalidate(6, uppercaseName = name.toUpperCase());
    		}

    		if ($$self.$$.dirty & /*name*/ 2) {
    			 console.log(name);
    		}

    		if ($$self.$$.dirty & /*name*/ 2) {
    			 if (name === "Maximilian") {
    				console.log("It runs!");
    				$$invalidate(5, age = 31);
    			}
    		}
    	};

    	return [
    		goal,
    		name,
    		title,
    		image,
    		description,
    		age,
    		uppercaseName,
    		incrementAge,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		textarea_input_handler,
    		input3_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
