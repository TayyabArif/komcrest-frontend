import React from 'react'

const Validate = ({excelData}) => {

    const thStyle = {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '4px',
      };
    
      const tdStyle = {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '4px',
      };
  return (
    <div className='w-full overflow-x-auto'>
        <h1 className='my-2 font-semibold'>Your table - 2021 CAIQ Questionnaire 20210914</h1>
       {excelData ? (
          <div>
            <table className='text-sm '  >
              <thead>
                <tr>
                  {excelData[0].map((header, index) => (
                    <th key={index} style={thStyle} >{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={tdStyle}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No data to display</p>
        )}
    </div>
  )
}

export default Validate