import { tw } from '@helpwave/common/twind'

const ReachoutSection = () => {
  return (
        <div className={tw('pt-32 pb-16 text-xl text-center')}>
            <h2 className={tw('font-space text-4xl font-bold')}>{`You're a medical hero?`}</h2>
            <h3 className={tw('font-sans text-1xl font-medium mt-2 mb-2 text-gray-600')}>
                How <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> aims to aid you in your daily work!
            </h3>
            <p className={tw('mb-5')}>
                <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> is a modern kanban interface that helps you to coordinate your work and the work of your team. Note down your tasks for your patient for yourself and for your team. Standardize workflows by saving them as a template and share them with your new coworker for easy onboarding. Receive notifications about upcoming tasks and use our various dashboards for keeping track of patients and courses of treatment. <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> is the first open-source team management platform for healthcare workers.
            </p>
            <h2 className={tw('font-space text-4xl font-bold')}>{`You're a hospital administrator?`}</h2>
            <h3 className={tw('font-sans text-1xl font-medium mt-2 mb-2 text-gray-600')}>
                How <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> can solve your issues!
            </h3>
            <p>
                <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> has been inspired by modern industry work flows and best practices from lean project management and applies them to the clinical environment. Keeping track of tasks and workflows in a clinical environment leads to better patient care and a more efficient use of resources. <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> can increase worker satisfaction and patient safety. Use it as a secure basis for your billing processes.
            </p>
        </div>
  )
}

export default ReachoutSection
