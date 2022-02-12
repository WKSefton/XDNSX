import {CheckIcon, SelectorIcon,} from '@heroicons/react/solid'
import {getProjects, updateProject} from "../lib/db/hasura";
import {useAppContext} from "../lib/utils/state";
import {Fragment, useEffect, useState} from "react";
import {Listbox, Transition} from '@headlessui/react'
import {classNames} from "../lib/utils/classNames";
import {useRouter} from "next/router";

const frequency = [
    {id: 0, name: 'Never'},
    {id: 1, name: 'Daily'},
    {id: 2, name: 'Weekly'},
    {id: 3, name: 'Bi-Weekly'},
    {id: 4, name: 'Monthly'},
    {id: 5, name: 'Quarterly'},
    {id: 6, name: 'Yearly'}
]
const attachments = [
    {name: 'resume_front_end_developer.pdf', href: '#'},
    {name: 'coverletter_front_end_developer.pdf', href: '#'},
]

// export async function getServerSideProps(context) {
//     // const {userId, token} = await RedirectUser(context);
//     //
//     // const {projects} = await getProjects(token, userId);
//     // const project = {
//     //   name: "test",
//     //   description: "asdff",
//     //   type: 1,
//     //   data: { test: "ASDF"}
//     // }
//     // const asdf = await createNewProject(token, project)
//     // console.log({asdf})
//
//     return {
//         props: {
//             projects,
//         },
//     };
// }


export default function Finance() {
    const router = useRouter()
    const state = useAppContext()

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncomes] = useState(0);

    console.log(expenses, incomes)
    useEffect(async () => {
        // setInterval(async () => {

        if (!state.token || !state.issuer)
            await router.push('/login')
        if (!state.projects) {
            const data = await getProjects(state.token, state.issuer);
            if (data?.projects) {
                state.projects = data.projects

                console.log("DATA RET", state.projects)
                const {incomes, expenses} = data.projects[0].data
                setIncomes(incomes)
                setExpenses(expenses)
            }
        } else {
        }
        // }, 5000)

    }, [])


    async function saveFinance() {
        const updatedProject = state.projects[0]
        updatedProject.data = {expenses, incomes}
        const update = await updateProject(state.token, state.projects[0])
        console.log("SAVED", update)
        const data = await getProjects(state.token, state.issuer);
        if (data?.projects) {
            state.projects = data.projects

            console.log("DATA RET 2", state.projects)
            const {incomes, expenses} = data.projects[0].data
            setIncomes(incomes)
            setExpenses(expenses)
        }
    }

    function updateTotalExpense(e, index) {
        e.preventDefault()
        expenses[index].cost = e.target.valueAsNumber
        console.log(e.target.valueAsNumber)
        let total = 0;
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].frequency.id != 0)
                total += expenses[i].cost
        }
        console.log(total)
        setTotalExpenses(total)
        setExpenses(expenses)
    }

    function updateTotalIncome(e, index) {
        e.preventDefault()
        incomes[index].cost = e.target.valueAsNumber
        console.log(e.target.valueAsNumber)
        let total = 0;
        for (let i = 0; i < incomes.length; i++) {
            if (incomes[i].frequency.id != 0)
                total += incomes[i].cost
        }
        console.log(total)
        setTotalIncomes(total)
        setIncomes(incomes)
    }

    function changeExpenseFreq(selection, expense) {
        console.log(selection, expense)

        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id == expense.id) {
                expenses[i].frequency = selection
                setExpenses(expenses)
                return;

            }
        }

    }

    function changeIncomeFreq(selection, income) {
        console.log(selection, income)

        for (let i = 0; i < incomes.length; i++) {
            if (incomes[i].id == income.id) {
                incomes[i].frequency = selection
                setIncomes(incomes)
                return;

            }
        }

    }


    function addExpense(e) {
        setExpenses([{id: expenses.length, cost: 0.00, frequency: frequency[0]}].concat(expenses))
    }

    function addIncome(e) {
        setIncomes([{id: incomes.length, cost: 0.00, frequency: frequency[0]}].concat(incomes))
    }

    return (
        <div className="mt-8 min-h-max mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-start-1 lg:col-span-1">
                <section aria-labelledby="applicant-information-title">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 id="applicant-information-title"
                                className="text-lg leading-6 font-medium text-gray-900">
                                Expenses
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2">

                                {expenses?.map((expense, i) => {
                                    return <Fragment key={expense.id}>
                                        <div className="sm:col-span-1">

                                            <div>
                                                <label htmlFor="price"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Cost
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                    </div>
                                                    <input
                                                        onChange={(e) => updateTotalExpense(e, i)}
                                                        value={expense.cost}
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="0.00"
                                                        aria-describedby="price-currency"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <Listbox value={expense.frequency}
                                                     onChange={(e) => changeExpenseFreq(e, expense)}>
                                                {({open}) => (
                                                    <>
                                                        <Listbox.Label className="block text-sm font-medium text-gray-700">Frequency</Listbox.Label>
                                                        <div className="mt-1 relative">
                                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                <span className="block truncate">{expense.frequency.name}</span>
                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
              </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                                    {frequency.map((freq) => (
                                                                        <Listbox.Option
                                                                            key={freq.id}
                                                                            className={({active}) =>
                                                                                classNames(
                                                                                    active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                                    'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                                )
                                                                            }
                                                                            value={freq}
                                                                        >
                                                                            {({selected, active}) => (
                                                                                <>
                                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                      {freq.name}
                                                                                    </span>

                                                                                    {selected ? (
                                                                                        <span className={classNames(
                                                                                            active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}
                                                                                        ><CheckIcon className="h-5 w-5"
                                                                                                    aria-hidden="true"/>                                                                                        </span>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    ))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </Fragment>
                                })}

                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                                    <dd className="mt-1 text-sm text-gray-900">$ {totalExpenses.toFixed(2)} USD</dd>
                                </div>
                                {/*<div className="sm:col-span-2">*/}
                                {/*    <dt className="text-sm font-medium text-gray-500">About</dt>*/}
                                {/*    <dd className="mt-1 text-sm text-gray-900">*/}
                                {/*        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim*/}
                                {/*        incididunt cillum culpa consequat.*/}
                                {/*        Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla*/}
                                {/*        mollit nostrud in ea officia*/}
                                {/*        proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit*/}
                                {/*        deserunt qui eu.*/}
                                {/*    </dd>*/}
                                {/*</div>*/}
                                {/*<div className="sm:col-span-2">*/}
                                {/*    <dt className="text-sm font-medium text-gray-500">Attachments</dt>*/}
                                {/*    <dd className="mt-1 text-sm text-gray-900">*/}
                                {/*        <ul role="list"*/}
                                {/*            className="border border-gray-200 rounded-md divide-y divide-gray-200">*/}
                                {/*            {attachments.map((attachment) => (*/}
                                {/*                <li*/}
                                {/*                    key={attachment.name}*/}
                                {/*                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"*/}
                                {/*                >*/}
                                {/*                    <div className="w-0 flex-1 flex items-center">*/}
                                {/*                        <PaperClipIcon*/}
                                {/*                            className="flex-shrink-0 h-5 w-5 text-gray-400"*/}
                                {/*                            aria-hidden="true"/>*/}
                                {/*                        <span*/}
                                {/*                            className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>*/}
                                {/*                    </div>*/}
                                {/*                    <div className="ml-4 flex-shrink-0">*/}
                                {/*                        <a href={attachment.href}*/}
                                {/*                           className="font-medium text-blue-600 hover:text-blue-500">*/}
                                {/*                            Download*/}
                                {/*                        </a>*/}
                                {/*                    </div>*/}
                                {/*                </li>*/}
                                {/*            ))}*/}
                                {/*        </ul>*/}
                                {/*    </dd>*/}
                                {/*</div>*/}
                            </dl>
                        </div>
                        <div>
                            <a
                                onClick={addExpense}
                                href="#"
                                className="block bg-gray-50 text-sm font-medium text-gray-500 text-center px-4 py-4 hover:text-gray-700 sm:rounded-b-lg"
                            >
                                Add Expense
                            </a>
                        </div>

                    </div>
                </section>
            </div>
            <div className="space-y-6 lg:col-start-2 lg:col-span-1">
                <section aria-labelledby="applicant-information-title">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 id="applicant-information-title"
                                className="text-lg leading-6 font-medium text-gray-900">
                                Incomes
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2">

                                {incomes?.map((income, i) => {
                                    return <Fragment key={income.id}>
                                        <div className="sm:col-span-1">

                                            <div>
                                                <label htmlFor="price"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Cost
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                    </div>
                                                    <input
                                                        onChange={(e) => updateTotalIncome(e, i)}
                                                        value={income.cost}
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="0.00"
                                                        aria-describedby="price-currency"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <Listbox value={income.frequency}
                                                     onChange={(e) => changeIncomeFreq(e, income)}>
                                                {({open}) => (
                                                    <>
                                                        <Listbox.Label className="block text-sm font-medium text-gray-700">Frequency</Listbox.Label>
                                                        <div className="mt-1 relative">
                                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                <span className="block truncate">{income.frequency.name}</span>
                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
              </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                                    {frequency.map((freq) => (
                                                                        <Listbox.Option
                                                                            key={freq.id}
                                                                            className={({active}) =>
                                                                                classNames(
                                                                                    active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                                    'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                                )
                                                                            }
                                                                            value={freq}
                                                                        >
                                                                            {({selected, active}) => (
                                                                                <>
                                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                      {freq.name}
                                                                                    </span>

                                                                                    {selected ? (
                                                                                        <span className={classNames(
                                                                                            active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}
                                                                                        ><CheckIcon className="h-5 w-5"
                                                                                                    aria-hidden="true"/>                                                                                        </span>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    ))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </Fragment>
                                })}

                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                                    <dd className="mt-1 text-sm text-gray-900">$ {totalIncome} USD</dd>
                                </div>
                                {/*<div className="sm:col-span-2">*/}
                                {/*    <dt className="text-sm font-medium text-gray-500">About</dt>*/}
                                {/*    <dd className="mt-1 text-sm text-gray-900">*/}
                                {/*        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim*/}
                                {/*        incididunt cillum culpa consequat.*/}
                                {/*        Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla*/}
                                {/*        mollit nostrud in ea officia*/}
                                {/*        proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit*/}
                                {/*        deserunt qui eu.*/}
                                {/*    </dd>*/}
                                {/*</div>*/}
                                {/*<div className="sm:col-span-2">*/}
                                {/*    <dt className="text-sm font-medium text-gray-500">Attachments</dt>*/}
                                {/*    <dd className="mt-1 text-sm text-gray-900">*/}
                                {/*        <ul role="list"*/}
                                {/*            className="border border-gray-200 rounded-md divide-y divide-gray-200">*/}
                                {/*            {attachments.map((attachment) => (*/}
                                {/*                <li*/}
                                {/*                    key={attachment.name}*/}
                                {/*                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"*/}
                                {/*                >*/}
                                {/*                    <div className="w-0 flex-1 flex items-center">*/}
                                {/*                        <PaperClipIcon*/}
                                {/*                            className="flex-shrink-0 h-5 w-5 text-gray-400"*/}
                                {/*                            aria-hidden="true"/>*/}
                                {/*                        <span*/}
                                {/*                            className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>*/}
                                {/*                    </div>*/}
                                {/*                    <div className="ml-4 flex-shrink-0">*/}
                                {/*                        <a href={attachment.href}*/}
                                {/*                           className="font-medium text-blue-600 hover:text-blue-500">*/}
                                {/*                            Download*/}
                                {/*                        </a>*/}
                                {/*                    </div>*/}
                                {/*                </li>*/}
                                {/*            ))}*/}
                                {/*        </ul>*/}
                                {/*    </dd>*/}
                                {/*</div>*/}
                            </dl>
                        </div>
                        <div>
                            <a
                                onClick={addIncome}
                                href="#"
                                className="block bg-gray-50 text-sm font-medium text-gray-500 text-center px-4 py-4 hover:text-gray-700 sm:rounded-b-lg"
                            >
                                Add Income
                            </a>
                        </div>

                    </div>
                </section>
            </div>

            <div className="space-y-6 lg:col-start-3 lg:col-span-1">
                <section aria-labelledby="applicant-information-title">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 id="applicant-information-title"
                                className="text-lg leading-6 font-medium text-gray-900">
                                Summary Information
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Summary of expenses</p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <br/>
                                calculations go here
                                <hr/>
                                TODO: Soon
                                <br/>
                            </dl>
                        </div>
                        <div>
                            <a href="#"
                               onClick={saveFinance}
                               className="block bg-gray-50 text-sm font-medium text-gray-500 text-center px-4 py-4 hover:text-gray-700 sm:rounded-b-lg">
                                Save Finance Calculation
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
