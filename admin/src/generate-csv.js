const formatHoldings = (holdings, investmentTotal, companies) => {
  let individualHoldings = [];
  const idToCompanyName = new Map();
  companies.map((company) => {
    idToCompanyName.set(company.id, company.name);
  });

  for (const company of holdings) {
    const id = company.id;
    const investmentPercentage = company.investmentPercentage;
    const name = idToCompanyName.get(id);

    individualHoldings.push({
      name,
      value: investmentPercentage * investmentTotal,
    });
  }
  return individualHoldings;
};

const mapCsvRows = (investments, companies) => {
  const records = [];
  for (const investment of investments) {
    const { userId, firstName, lastName, investmentTotal, date, holdings } =
      investment;

    const holdingData = formatHoldings(holdings, investmentTotal, companies);

    holdingData.forEach((holding) => {
      records.push({
        firstName,
        lastName,
        userId,
        date,
        holding: holding.name,
        value: holding.value,
      });
    });
  }
  return records;
};

const generateCsv = (investments, companies) => {
  const headings = "|User|First Name|Last Name|Date|Holding|Value|\n";
  const rows = mapCsvRows(investments, companies);
  formattedRows = rows.map(
    (row) =>
      `|${row.userId}|${row.firstName}|${row.lastName}|${row.date}|${row.holding}|${row.value}|`
  );
  return headings + formattedRows.join("\n");
};

module.exports = { formatHoldings, mapCsvRows, generateCsv };
