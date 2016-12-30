namespace mirage.html {
    export interface IAnimClock {
        enable();
        disable();
    }

    export interface IAnimFrame {
        (now: number, delta: number): void;
    }

    export function NewAnimClock(onFrame: IAnimFrame): IAnimClock {
        let enabled = false;
        let last = NaN;

        function tick(now: number) {
            if (!enabled)
                return;
            onFrame(now, isNaN(last) ? 0 : now - last);
            last = now;
            if (enabled)
                window.requestAnimationFrame(tick);
        }

        return {
            enable() {
                enabled = true;
                window.requestAnimationFrame(tick);
            },
            disable() {
                enabled = false;
                last = NaN;
            },
        };
    }
}