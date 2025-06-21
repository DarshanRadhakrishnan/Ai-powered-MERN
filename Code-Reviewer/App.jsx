import { useState,useEffect } from "react";
import prism from "prismjs"//this is used for converting  a text into a code tyoe design based on what language we give
import Editor from "react-simple-code-editor"//this is the left side pane like canvas which is used to take the code like an input text in html
import Markdown from "react-markdown"//Used to display the ouptut form the gpt in the form of a md file
import axios from "axios"
import rehypehighlight from "rehype-highlight"//this is like prism but used for output
import "highlight.js/styles/github-dark.css";
import "prismjs/themes/prism-tomorrow.css"

function App(){
  const [ code, setCode ] = useState(` function sum() {
    return 1 + 1
  }`)
  const [ review, setReview ] = useState(``)
  useEffect(() => {
      prism.highlightAll()
    }, [])
  async function reviewCode() {
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
    }

  return(
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <Markdown

            rehypePlugins={[ rehypeHighlight ]}

          >{review}</Markdown>
        </div>
      </main>
    </>
            )
          }
        
