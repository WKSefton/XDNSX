import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, SelectorIcon} from "@heroicons/react/solid";
import {classNames} from "../lib/classNames";
import {Fragment, useState} from "react";

export default function FinanceList(props) {
    console.log(props)
    let total = 0;
    const [items, setItems] = useState(props.items ? props.items : [])

    const [newItem, setNewItem] = useState({
        id: props.items.length,
        label: "None",
        value: 0.00,
        frequency: props.frequencyOptions[0]
    })

    function updateTotal() {
        if (items.length > 0)
            total = items.map(item => parseFloat(item.value)).reduce((x, y) => {
                return x += y
            })
    }

    function updateItemValue(e) {
        console.log(e)
        newItem.value = +e.target.value;
        setNewItem(newItem)
    }

    function updateItemLabel(e) {
        console.log(e)
        newItem.label = e.target.value;
        setNewItem(newItem)
    }

    function updateItemFreq(e) {
        console.log(e)
        newItem.frequency = e;
        setNewItem(newItem)
    }

    function removeItem(index) {
        props.items.splice(index, 1)
        setItems([...props.items])
        props.setItems([...props.items]);
    }

    function addItem() {
        props.items.unshift({
            id: props.items.length,
            label: newItem.label,
            value: newItem.value,
            frequency: newItem.frequency
        })
        setItems([...props.items])
        props.setItems([...props.items]);
    }

    updateTotal();
    return (
        <div className="bg-white shadow sm:rounded-lg">

            <div className="px-4 my-5 sm:px-6 bg-gray-200 text-gray-800">

                <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
                <div className="flex py-4 justify-center items-center hover:cursor-pointer" onClick={addItem}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="h-6 w-6"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
            </div>


            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-3 gap-x-4 gap-y-8 ">

                    <div className="col-span-1">
                        <div>
                            <label htmlFor="descript"
                                   className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    onChange={updateItemLabel}
                                    type="text"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Description"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
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
                                    defaultValue="0.00"
                                    onChange={updateItemValue}
                                    type="text"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="0.00"
                                />

                                <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                                              <span className=" absolute text-gray-500 sm:text-sm" id="price-currency">
                                                USD
                                              </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <Listbox
                            onChange={updateItemFreq}
                            value={props.frequencyOptions[0]}>
                            {({open}) => (
                                <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Frequency</Listbox.Label>
                                    <div className="mt-1 relative">
                                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">{props.frequencyOptions[0].name}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                            <SelectorIcon className="h-5 w-5 text-gray-400"
                                                                          aria-hidden="true"/>
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
                                                {props.frequencyOptions.map((freq) => (
                                                    <Listbox.Option
                                                        key={freq.id}
                                                        className={({active}) =>
                                                            classNames(
                                                                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                'cursor-default select-none relative py-2 pl-3 pr-9'
                                                            )}
                                                        value={freq}>
                                                        {({selected, active}) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                  {freq.name}
                                                                </span>

                                                                {selected ? (
                                                                    <span className={classNames(
                                                                        active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}
                                                                    ><CheckIcon className="h-5 w-5"
                                                                                aria-hidden="true"/>
                                                                    </span>
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

                    <table className="col-span-3 min-w-full divide-y divide-gray-200">
                        <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td width="45%"
                                    className={"px-6 py-4 whitespace-nowrap text-center text-sm font-medium " + (props.type == 0 ? "text-red-500" : "text-green-500")}>{props.type == 0 ? '-' : '+'} {" " + item.value.toFixed(2) + " "}
                                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                USD
                                              </span>
                                </td>
                                <td width="45%"
                                    className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">{item.label}</td>
                                <td width="45%"
                                    className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">{item.frequency.name}</td>
                                <td width="10%"
                                    className="px-6 py-4 whitespace-nowrap flex flex-end text-sm font-medium">
                                    <div className="inset-y-0 right-0 pr-3 flex place-items-end cursor-pointer"
                                         onClick={(e) => removeItem(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-6 w-6"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             stroke="red">
                                            <path strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>

                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Total</dt>
                        <dd className={"mt-1 text-sm " + (props.type == 0 ? "text-red-500" : "text-green-500")}>$ {props.type == 0 ? '-' : '+'}{" " + total.toFixed(2) + " "}
                            <span className="text-gray-500 sm:text-sm" id="price-currency">USD</span>
                        </dd>
                    </div>

                </dl>

            </div>


        </div>
    );
}