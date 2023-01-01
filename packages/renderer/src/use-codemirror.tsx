import { useEffect, useState, useRef, MutableRefObject } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { history , historyKeymap } from "@codemirror/commands";
import { defaultHighlightStyle, HighlightStyle, indentOnInput ,language,syntaxHighlighting } from "@codemirror/language";
import { bracketMatching } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";

export const transparentTheme = EditorView.theme({
    '&': {
        backgraoundColor: 'transparent !important',
        height: '100%'
    }
})

const syntaxHighlightingVal = HighlightStyle.define([
    {
        tag: tags.heading1,
        fontSize: '1.6em',
        fontWeight: 'bold'
    },
    {
        tag: tags.heading2,
        fontSize: '1.4em',
        fontWeight: 'bold'
    },
    {
        tag: tags.heading3,
        fontSize: '1.3em',
        fontWeight: 'bold'
    }
])

interface Props {
    initialDoc: string,
    onChange?: (state: EditorState) => void
}

const useCodeMirror = <T extends Element> (
    props: Props
): [ MutableRefObject<T | null>, EditorView?] => {
    const refContainer = useRef<T>(null)
    const [editorView, setEditorView] = useState<EditorView>()
    const {onChange} = props

    useEffect(() => {
        if (!refContainer.current) return
        
        const startState = EditorState.create({
            doc: props.initialDoc,
            extensions: [
                keymap.of([...defaultKeymap, ...historyKeymap]),
                lineNumbers(),
                highlightActiveLineGutter(),
                history(),
                indentOnInput(),
                bracketMatching(),
                highlightActiveLine(),
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                    addKeymap: true
                }),
                oneDark,
                transparentTheme,
                syntaxHighlighting(syntaxHighlightingVal),
                EditorView.lineWrapping,
                EditorView.updateListener.of(update => {
                    if (update.changes){
                        onChange && onChange(update.state)
                    }
                })
            ]
        })

        const view = new EditorView({
            state: startState,
            parent: refContainer.current
        })
        setEditorView(view)
    }, [refContainer])
    
    return [refContainer, editorView]
}

export default useCodeMirror