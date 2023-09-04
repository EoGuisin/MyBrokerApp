import { BaseAnimationBuilder } from '../animationBuilder/BaseAnimationBuilder';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export class ZoomIn extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomIn();
    }
}
export class ZoomInRotate extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const rotate = this.rotateV ? this.rotateV : '0.3';
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            { scale: delayFunction(delay, animation(1, config)) },
                            { rotate: delayFunction(delay, animation(0, config)) },
                        ],
                    },
                    initialValues: {
                        transform: [{ scale: 0 }, { rotate: rotate }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInRotate();
    }
}
export class ZoomInLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                        originX: delayFunction(delay, animation(values.originX, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                        originX: values.originX - width,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInLeft();
    }
}
export class ZoomInRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                        originX: delayFunction(delay, animation(values.originX, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                        originX: values.originX + width,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInRight();
    }
}
export class ZoomInUp extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                        originY: delayFunction(delay, animation(values.originY, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                        originY: values.originY - height,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInUp();
    }
}
export class ZoomInDown extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                        originY: delayFunction(delay, animation(values.originY, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                        originY: values.originY + height,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInDown();
    }
}
export class ZoomInEasyUp extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                        originY: delayFunction(delay, animation(values.originY, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                        originY: -values.height,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInEasyUp();
    }
}
export class ZoomInEasyDown extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(1, config)) }],
                        originY: delayFunction(delay, animation(values.originY, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                        originY: values.height,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomInEasyDown();
    }
}
export class ZoomOut extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOut();
    }
}
export class ZoomOutRotate extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const rotate = this.rotateV ? this.rotateV : '0.3';
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            { scale: delayFunction(delay, animation(0, config)) },
                            { rotate: delayFunction(delay, animation(rotate, config)) },
                        ],
                    },
                    initialValues: {
                        transform: [{ scale: 1 }, { rotate: '0' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutRotate();
    }
}
export class ZoomOutLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                        originX: delayFunction(delay, animation(values.originX - width, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                        originX: values.originX,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutLeft();
    }
}
export class ZoomOutRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                        originX: delayFunction(delay, animation(values.originX + width, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                        originX: values.originX,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutRight();
    }
}
export class ZoomOutUp extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                        originY: delayFunction(delay, animation(values.originY - height, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                        originY: 0,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutUp();
    }
}
export class ZoomOutDown extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                        originY: delayFunction(delay, animation(values.originY + height, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                        originY: 0,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutDown();
    }
}
export class ZoomOutEasyUp extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                        originY: delayFunction(delay, animation(-values.height, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                        originY: 0,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutEasyUp();
    }
}
export class ZoomOutEasyDown extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scale: delayFunction(delay, animation(0, config)) }],
                        originY: delayFunction(delay, animation(values.height, config)),
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                        originY: 0,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new ZoomOutEasyDown();
    }
}
