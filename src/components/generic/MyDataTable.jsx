import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import React from "react";


const MyDataTable = ({data, columns, options = {}}) => {
    DataTable.use(DT);
    /**
     * Structure of the DataTable dom property
     * l - Length changing input control
     * f - Filtering input
     * r - Processing display element
     * t - The table
     * i - Table information summary
     * p - Pagination control
     */
    options = {
        dom: "<<f><'mt-2'tr><'row justify-content-between align-items-center mt-2'<'col-lg-auto col-md-12'l><'col-lg-auto col-md-12'i><'col-lg-auto col-md-12'p>>>",
        ...options
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            className={"table"}
            options={options}
        >
            <thead className={"table-sky"}>
            <tr>
                {
                    columns.map((column, index) => {
                        return (
                            <th key={index}>{column.title}</th>
                        );
                    })
                }
            </tr>
            </thead>
        </DataTable>
    );
}

export default MyDataTable;
