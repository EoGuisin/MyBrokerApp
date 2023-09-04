import { BaseAnimationBuilder } from '../animationBuilder/BaseAnimationBuilder';
export class FadeIn extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return (_) => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(1, config)),
                    },
                    initialValues: {
                        opacity: 0,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeIn();
    }
}
export class FadeInRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(1, config)),
                        transform: [
                            { translateX: delayFunction(delay, animation(0, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 0,
                        transform: [{ translateX: 25 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeInRight();
    }
}
export class FadeInLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(1, config)),
                        transform: [
                            { translateX: delayFunction(delay, animation(0, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 0,
                        transform: [{ translateX: -25 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeInLeft();
    }
}
export class FadeInUp extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(1, config)),
                        transform: [
                            { translateY: delayFunction(delay, animation(0, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 0,
                        transform: [{ translateY: -25 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeInUp();
    }
}
export class FadeInDown extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(1, config)),
                        transform: [
                            { translateY: delayFunction(delay, animation(0, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 0,
                        transform: [{ translateY: 25 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeInDown();
    }
}
export class FadeOut extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return (_) => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(0, config)),
                    },
                    initialValues: {
                        opacity: 1,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeOut();
    }
}
export class FadeOutRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(0, config)),
                        transform: [
                            { translateX: delayFunction(delay, animation(25, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 1,
                        transform: [{ translateX: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeOutRight();
    }
}
export class FadeOutLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(0, config)),
                        transform: [
                            { translateX: delayFunction(delay, animation(-25, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 1,
                        transform: [{ translateX: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeOutLeft();
    }
}
export class FadeOutUp extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(0, config)),
                        transform: [
                            { translateY: delayFunction(delay, animation(-25, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 1,
                        transform: [{ translateY: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeOutUp();
    }
}
export class FadeOutDown extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const callback = this.callbackV;
            const delay = this.delayV;
            return () => {
                'worklet';
                return {
                    animations: {
                        opacity: delayFunction(delay, animation(0, config)),
                        transform: [
                            { translateY: delayFunction(delay, animation(25, config)) },
                        ],
                    },
                    initialValues: {
                        opacity: 1,
                        transform: [{ translateY: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new FadeOutDown();
    }
}
