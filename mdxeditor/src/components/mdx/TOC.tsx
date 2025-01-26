"use client";

const TOC = ({toc}: any) => {
  return (
    <nav className="toc">
        {toc.map((item: any) => (
          <a href={`#${item.slug}`} key={item.slug}>
            {item.text}
          </a>
        ))}
      </nav>
  )
}

export default TOC
