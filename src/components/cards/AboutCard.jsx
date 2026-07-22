
function AboutCard({id, icon: Icon, title, description}) {
  return (
    <div>
        <div key={id} className="rounded-xl bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
           
            <Icon className="text-center size-8 text-primary-Blue" />
            <a href="#">
                <h5 className="my-2 text-2xl font-semibold tracking-tight text-heading"> {title} </h5>
            </a>
            <p className="mb-3 text-body line-clamp-3 ">{description}</p>
           
        </div>
    </div>
  )
}

export default AboutCard