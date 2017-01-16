namespace mirage.html {
    /*
     The Element Translator translates the data-layout attribute into a layout node
     If it is detected that "type" changed during a data-layout change,
     a new filled layout node will be returned, but not replaced in the layout tree
     During any translation, if null is returned, the node should be destroyed
     */

    export interface IElementTranslator {
        translateNew(el: Element): core.LayoutNode;
        translateChange(el: Element, node: core.LayoutNode, oldDataLayout: string): core.LayoutNode;
    }
    interface IDataLayoutHash {
        [property: string]: string;
    }
    export function NewElementTranslator(): IElementTranslator {
        function parseDataLayout(dataLayout: string): IDataLayoutHash {
            let hash: IDataLayoutHash = {};
            for (let tokens = dataLayout.split(";"), i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                let index = token.indexOf(':');
                if (index < 0)
                    continue;
                hash[token.substr(0, index).trim()] = token.substr(index + 1).trim();
            }
            return hash;
        }

        function applyHash(node: core.LayoutNode, hash: IDataLayoutHash) {
            for (let keys = Object.keys(hash), i = 0; i < keys.length; i++) {
                let key = keys[i];
                let mapper = mirage.map.getMapper(key);
                if (mapper)
                    mapper(node, hash[key]);
            }
        }

        return {
            translateNew(el: Element): core.LayoutNode {
                let hash = parseDataLayout(el.getAttribute("data-layout"));
                let type = hash["type"];
                if (!type)
                    return null;
                (<HTMLElement>el).style.display = "none";
                let node = mirage.createNodeByType(type);
                if (type === "html")
                    HtmlNode.setElement(node, <HTMLElement>el);
                applyHash(node, hash);
                return node;
            },
            translateChange(el: Element, node: core.LayoutNode, oldDataLayout: string): core.LayoutNode {
                let oldHash = parseDataLayout(oldDataLayout);
                let newHash = parseDataLayout(el.getAttribute("data-layout"));
                let newType = newHash["type"];
                if (!newType)
                    return null;
                if (oldHash["type"] !== newType) {
                    let newNode = mirage.createNodeByType(newType);
                    applyHash(newNode, newHash);
                    return newNode;
                }

                // Unset values that exist in old, but not in new
                let oldKeys = Object.keys(oldHash);
                let newKeys = Object.keys(newHash);
                for (let i = 0; i < oldKeys.length; i++) {
                    let key = oldKeys[i];
                    if (newKeys.indexOf(key) > -1)
                        continue;
                    let mapper = mirage.map.getMapper(key);
                    if (mapper)
                        mapper(node, undefined);
                }

                applyHash(node, newHash);
                return node;
            },
        };
    }
}