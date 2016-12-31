namespace mirage.html {
    export interface IElementTranslator {
        translateNew(el: Element): core.LayoutNode;
        translateChange(node: core.LayoutNode, oldDataLayout: string, newDataLayout: string): void;
    }
    interface IDataLayoutHash {
        [property: string]: string;
    }
    export function NewElementTranslator(): IElementTranslator {
        function parseDataLayout(el: Element): IDataLayoutHash {
            let hash: IDataLayoutHash = {};
            for (let tokens = el.getAttribute("data-layout").split(";"), i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                let index = token.indexOf(':');
                if (index < 0)
                    continue;
                hash[token.substr(0, index).trim()] = token.substr(index + 1).trim();
            }
            return hash;
        }

        return {
            translateNew(el: Element): core.LayoutNode {
                let hash = parseDataLayout(el);
                let type = hash["type"];
                if (!type)
                    return null;
                let node = mirage.createNodeByType(type);
                for (let keys = Object.keys(hash), i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let mapper = mirage.map.getMapper(key);
                    if (mapper)
                        mapper(node, hash[key]);
                }
                return node;
            },
            translateChange(node: core.LayoutNode, oldDataLayout: string, newDataLayout: string): void {
                // TODO:
                // NOTE: Make sure to check for "type" changing
            },
        };
    }
}