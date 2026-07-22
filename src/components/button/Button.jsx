
function Button({text, bg}) {
  return (
    <div>
        <button type="button" className={`text-white ${bg}   border-transparent border hover:bg-brand-strong focus:ring-4 
            focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-2.5 focus:outline-none`}>{text}
        </button>
    </div>
  )
}

export default Button