import {getProjects, updateProject} from "../lib/hasura";
import {Fragment, useEffect, useState} from "react";
import {Tab} from '@headlessui/react'
import {classNames} from "../lib/classNames";
import RedirectUser from "../lib/redirectUser";
import FinanceList from "../components/financeList";
import Head from "next/head";
import PieChart from "../components/pieChart";

const frequency = [
    {id: 0, name: 'Once'},
    {id: 1, name: 'Daily'},
    {id: 2, name: 'Weekly'},
    {id: 3, name: 'Bi-Weekly'},
    {id: 4, name: 'Monthly'},
    {id: 5, name: 'Quarterly'},
    {id: 6, name: 'Yearly'},
    {id: -1, name: 'Never'}
]
const tabSeed = [
    {name: 'Expenses', href: '#', current: true},
    {name: 'Income', href: '#', current: false},
    {name: 'Finance Summary', href: '#', current: false}
]

export async function getServerSideProps(context) {
    const {userId, token} = await RedirectUser(context);

    const {projects} = await getProjects(token, userId);

    return {
        props: {
            projects,
            token,
            userId
        },
    };
}

export default function Finance({projects, token, userId}) {

    const [expenses, setExpenses] = useState(projects[0].data.expenses);
    const [incomes, setIncomes] = useState(projects[0].data.incomes);

    const [tabs, setTabs] = useState(tabSeed);

    async function saveFinance() {
        // const projectToUpdate = projects[0]
        // projectToUpdate.data = {expenses, incomes}
        // const update = await updateProject(token, projectToUpdate)
        // console.log("SAVED", update)
        // router.push('/finance')
    }


    async function changeTab(tab) {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].name == tab.name)
                tabs[i].current = true;
            else
                tabs[i].current = false;
        }
        setTabs([...tabs])
    }


    useEffect(async () => {
        const projectToUpdate = projects[0]
        projectToUpdate.data = {expenses, incomes}
        await updateProject(token, projectToUpdate)
    }, [expenses, incomes])

    return (
        <div className="mt-8 min-h-max mx-auto ">
            <Head>
                <title>Personal Finance</title>
            </Head>

            <Tab.Group>
                <div className="border-b border-gray-200">
                    <Tab.List>
                        <div className="-mb-px flex justify-center" aria-label="Tabs">

                            {tabs.map((tab, tabIdx) => (
                                <Tab key={tab.name} as={Fragment}>
                                    <a onClick={(e) => changeTab(tab)}
                                       className={classNames(
                                           tab.current
                                               ? 'border-indigo-500 text-indigo-600'
                                               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                           'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm', 'hover:cursor-pointer'
                                       )}
                                       aria-current={tab.current ? 'page' : undefined}
                                    >
                                        <span>{tab.name}</span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                tab.current ? 'bg-blue-500' : 'bg-transparent',
                                                ' inset-x-0 bottom-0 h-0.5'
                                            )}
                                        />
                                    </a>
                                </Tab>
                            ))}

                        </div>
                    </Tab.List>
                </div>

                <div className="grid grid-cols-2 max-w-7xl max-h-fit mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="col-span-1 mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <PieChart name="expensesPC"
                                  data={expenses}
                                  innerRadius={0}
                                  outerRadius={100}
                                  type={0}/>
                    </div>
                    <div className="col-span-1 mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <PieChart name="incomesPC"
                                  data={incomes}
                                  innerRadius={0}
                                  outerRadius={100}
                                  type={1}/>
                    </div>

                </div>

                <Tab.Panels>
                    <Tab.Panel>
                        <FinanceList type={0}
                                     name="Expenses"
                                     items={expenses}
                                     frequencyOptions={frequency}
                                     setItems={setExpenses}/>
                    </Tab.Panel>
                    <Tab.Panel>
                        <FinanceList type={1}
                                     name="Income"
                                     items={incomes}
                                     frequencyOptions={frequency}
                                     setItems={setIncomes}/>
                    </Tab.Panel>
                    <Tab.Panel>
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
                                        <a //href="#"
                                            onClick={saveFinance}
                                            className="block bg-gray-50 text-sm font-medium text-gray-500 text-center px-4 py-4 hover:text-gray-700 sm:rounded-b-lg">
                                            Save Finance Calculation
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

        </div>
    );
}