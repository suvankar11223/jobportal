import  { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { X, Briefcase, DollarSign } from 'lucide-react'

const fitlerData = [
    {
        fitlerType: "Industry",
        icon: Briefcase,
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "AI/ML Engineer", "Data Scientist", "Data Analyst", "Devops engineer", "Software Engineer"]
    },
    {
        fitlerType: "Salary",
        icon: DollarSign,
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh", "5lakh to 10lakh", "10lakh to 20lakh", "20lakh to 50lakh", "50lakh to 1 crore"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    const clearFilters = () => {
        setSelectedValue('');
    }

    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

    return (
        <div className='w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-xl text-gray-800'>Filter Jobs</h1>
                {selectedValue && (
                    <Button 
                        onClick={clearFilters}
                        variant="ghost" 
                        size="sm"
                        className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 text-sm'
                    >
                        <X className='w-4 h-4 mr-1' />
                        Clear
                    </Button>
                )}
            </div>
            <hr className='border-gray-200 mb-6' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    fitlerData.map((data, index) => {
                        const IconComponent = data.icon;
                        return (
                            <div key={data.fitlerType} className='mb-8 last:mb-0'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3'>
                                        <IconComponent className='w-4 h-4 text-purple-600' />
                                    </div>
                                    <h2 className='font-semibold text-lg text-gray-700'>{data.fitlerType}</h2>
                                </div>
                                <div className='space-y-2 ml-2'>
                                    {
                                        data.array.map((item, idx) => {
                                            const itemId = `id${index}-${idx}`
                                            const isSelected = selectedValue === item;
                                            return (
                                                <div 
                                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                                                        isSelected 
                                                            ? 'bg-purple-50 border-purple-200 shadow-sm' 
                                                            : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                                                    }`} 
                                                    key={itemId}
                                                    onClick={() => changeHandler(item)}
                                                >
                                                    <RadioGroupItem value={item} id={itemId} className='text-purple-600' />
                                                    <Label 
                                                        htmlFor={itemId} 
                                                        className={`text-sm cursor-pointer flex-1 font-medium ${
                                                            isSelected ? 'text-purple-700' : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {item}
                                                    </Label>
                                                    {isSelected && (
                                                        <div className='w-2 h-2 bg-purple-600 rounded-full'></div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard
