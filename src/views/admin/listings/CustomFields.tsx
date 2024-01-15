// CustomFields.tsx

import React from 'react';

const CustomFields = ({ customFields }: any) => {

    const renderCustomFields = () => {
        return customFields.map((field: any) => (
            <>
                <div className='bg-slate-100 py-4'>
                    <div key={field.id} className="mb-4 flex items-center justify-end">
                        <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            {field.title}:
                        </label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                </div>
            </>
        ));
    };

    return <div className='my-4'>{renderCustomFields()}</div>;
};

export default CustomFields;
