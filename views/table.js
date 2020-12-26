function createHtmlTable(data) {
    let string = `<style>
    table {
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    
    th {
        background: white;
        position: sticky;
        top: 0;
        box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
    }

    td, th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    tr:nth-child(even){background-color: #f2f2f2;}
    
    tr:hover {background-color: #ddd;}
    
    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
    }

    .value {
        background-color: red;
    }

    .value-low {
        background-color: #c5c5c5;
    }

    </style><table>`

    string += '<tr>'
    for (let j in data[0]) {
        string += `<th>${j}</th>`
    }
    string += '</tr>'

    for (let i = 0; i < data.length; i++) {
        const tr = data[i]
        string += '<tr>'
        for (let j in tr) {
            let classValue = ''
            if (j == 'valueAway' && tr[j] > 1 && tr['awayOdd'] < 2) {
                classValue = 'value'
            } else if(j == 'valueAway' && tr[j] > 1 && tr['awayOdd'] > 2 && tr['awayOdd'] < 3) {
                classValue = 'value-low'
            }

            if (j == 'valueHome' && tr[j] > 1 && tr['homeOdd'] < 2) {
                classValue = 'value'
            } else if (j == 'valueHome' && tr[j] > 1 && tr['homeOdd'] > 2 && tr['homeOdd'] < 3) {
                classValue = 'value-low'
            }

            

            string += `<td class="${classValue}">${tr[j]}</td>`
        }
        string += '</tr>'
    }
    string += '</table>'
    return string
}

module.exports = {
    createHtmlTable
}