namespace mirage.html {
    export interface IOrchestrator {
        tree: ITreeTracker;
        binders: IBinder[];
        registry: IBinderRegistry;
        sync: ITreeSynchronizer;
        start();
        stop();
    }

    export function NewOrchestrator(target: Node): IOrchestrator {
        let tree = NewTreeTracker();
        let binders: IBinder[] = [];
        let registry = NewBinderRegistry(tree, binders);
        let sync = NewTreeSynchronizer(target, tree, registry);
        let clock = NewAnimClock(onFrame);

        function onFrame(now: number, delta: number) {
            for (let i = 0; i < binders.length; i++) {
                binders[i].run();
            }
        }

        return {
            tree: tree,
            binders: binders,
            registry: registry,
            sync: sync,
            start() {
                sync.start();
                clock.enable();
            },
            stop() {
                clock.disable();
                sync.stop();
            },
        };
    }
}