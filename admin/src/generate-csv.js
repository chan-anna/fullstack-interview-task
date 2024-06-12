const mapHoldingsToCompany = (holding, investmentTotal, companies) => {
  let individualHoldings = [];
  const idToCompanyName = new Map();
  companies.map((company) => {
    idToCompanyName.set(company.id, company.name);
  });

  for (const company of holding) {
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

    const holdingData = mapHoldingsToCompany(
      holdings,
      investmentTotal,
      companies
    );

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
module.exports = { mapHoldingsToCompany, mapCsvRows };
