"use client";

/**
 * Section heading — serif title (Fraunces, like the projects section) plus a
 * handwritten Caveat kicker and a hand-drawn red underline to tie it to the
 * whiteboard below.
 */
export function BoardHeader(): React.JSX.Element {
  return (
    <div className="mb-9 flex flex-col items-center gap-2 text-center sm:mb-11">
      <p className="font-inter rotate-[-1.5deg] text-xl leading-none text-[#f2b8b5] sm:text-2xl">
        focusing...right now
      </p>
      <h2 className="font-serif text-[2rem] leading-[1.1] font-medium tracking-tight text-[#f5f5f4] sm:text-[2.5rem]">
        What I&rsquo;m building &amp; learning
      </h2>
      <svg
        width={190}
        height={12}
        viewBox="0 0 190 12"
        fill="none"
        aria-hidden="true"
        className="mt-1"
      >
        <path
          d="M6 8Q26 2 48 8T92 8T136 8T184 8"
          stroke="#d64545"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
