import './RichText.css'
// #hashtags and @names pick up the accent colour; web addresses in the text
// (posters often say "Apply here https://...") become real links, without
// swallowing the full stop that ends the sentence. Email addresses are left
// alone (an @ inside a word is not a mention).
export default function RichText({ text }) {
  return text.split(/(https?:\/\/[^\s<>"]+|#[\p{L}\p{N}_]+|(?<![\p{L}\p{N}_.])@[\p{L}\p{N}_.]+)/u).map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,;:!?)\]]+$/, '')
      return (
        <span key={i}>
          <a className="rt-url" href={url} target="_blank" rel="noreferrer">{url.replace(/^https?:\/\/(www\.)?/, '')}</a>
          {part.slice(url.length)}
        </span>
      )
    }
    return /^[#@]/.test(part) ? <span key={i} className="rt-tag">{part}</span> : part
  })
}
