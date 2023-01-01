import React, { createElement, Fragment, useEffect, useState } from "react";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import "./preview.css"
import 'github-markdown-css/github-markdown.css'

interface Props {
    doc: string
}

const Preview: React.FC<Props> = (props) => {
    const md: any = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkReact, {
            createElement: React.createElement,
          } as any)
        .processSync(props.doc).result


    return <div className="preview-markdown-body">{md}</div>
}

export default Preview