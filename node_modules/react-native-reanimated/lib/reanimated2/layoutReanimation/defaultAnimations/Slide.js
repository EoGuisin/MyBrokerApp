import { BaseAnimationBuilder } from '../animationBuilder/BaseAnimationBuilder';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export class SlideInRight extends BaseAnimationBuilder {
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
                        originX: delayFunction(delay, animation(values.originX, config)),
                    },
                    initialValues: {
                        originX: values.originX + width,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideInRight();
    }
}
export class SlideInLeft extends BaseAnimationBuilder {
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
                        originX: delayFunction(delay, animation(values.originX, config)),
                    },
                    initialValues: {
                        originX: values.originX - width,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideInLeft();
    }
}
export class SlideOutRight extends BaseAnimationBuilder {
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
                        originX: delayFunction(delay, animation(values.originX + width, config)),
                    },
                    initialValues: {
                        originX: values.originX,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideOutRight();
    }
}
export class SlideOutLeft extends BaseAnimationBuilder {
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
                        originX: delayFunction(delay, animation(values.originX - width, config)),
                    },
                    initialValues: {
                        originX: values.originX,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideOutLeft();
    }
}
export class SlideInUp extends BaseAnimationBuilder {
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
                        originY: delayFunction(delay, animation(values.originY, config)),
                    },
                    initialValues: {
                        originY: height,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideInUp();
    }
}
export class SlideInDown extends BaseAnimationBuilder {
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
                        originY: delayFunction(delay, animation(values.originY, config)),
                    },
                    initialValues: {
                        originY: values.originY - height,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideInDown();
    }
}
export class SlideOutUp extends BaseAnimationBuilder {
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
                        originY: delayFunction(delay, animation(values.originY - height, config)),
                    },
                    initialValues: {},
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideOutUp();
    }
}
export class SlideOutDown extends BaseAnimationBuilder {
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
                        originY: delayFunction(delay, animation(values.originY + height, config)),
                    },
                    initialValues: {},
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new SlideOutDown();
    }
}
