const {
  mapCsvRows,
  mapHoldingsToCompany,
  generateCsv,
} = require("./generate-csv");

const data = {
  investmentTotal: 20000,
  holdings: [
    { id: "1", investmentPercentage: 0.5 },
    { id: "2", investmentPercentage: 0.5 },
  ],
};

const investments = [
  {
    id: "1",
    userId: "1",
    firstName: "Billy",
    lastName: "Bob",
    investmentTotal: 1400,
    date: "2020-01-01",
    holdings: [{ id: "2", investmentPercentage: 1 }],
  },
  {
    id: "2",
    userId: "2",
    firstName: "Sheila",
    lastName: "Aussie",
    investmentTotal: 20000,
    date: "2020-01-01",
    holdings: [
      { id: "1", investmentPercentage: 0.5 },
      { id: "2", investmentPercentage: 0.5 },
    ],
  },
];

const companies = [
  {
    id: "1",
    name: "The Big Investment Company",
    address: "14 Square Place",
    postcode: "SW18UU",
    frn: "234165",
  },
  {
    id: "2",
    name: "The Small Investment Company",
    address: "12 Circle Square",
    postcode: "SW18UD",
    frn: "773388",
  },
  {
    id: "3",
    name: "Capital Investments",
    address: "1 Capital Road",
    postcode: "SW18UT",
    frn: "078592",
  },
];

describe("generate cvs", () => {
  it("should correctly map holding data", () => {
    expect(
      mapHoldingsToCompany(data.holdings, data.investmentTotal, companies)
    ).toEqual([
      { name: "The Big Investment Company", value: 10000 },
      { name: "The Small Investment Company", value: 10000 },
    ]);
  });

  it("should correctly map csv rows", () => {
    const result = mapCsvRows(investments, companies);
    expect(result).toEqual([
      {
        date: "2020-01-01",
        firstName: "Billy",
        holding: "The Small Investment Company",
        lastName: "Bob",
        userId: "1",
        value: 1400,
      },
      {
        date: "2020-01-01",
        firstName: "Sheila",
        holding: "The Big Investment Company",
        lastName: "Aussie",
        userId: "2",
        value: 10000,
      },
      {
        date: "2020-01-01",
        firstName: "Sheila",
        holding: "The Small Investment Company",
        lastName: "Aussie",
        userId: "2",
        value: 10000,
      },
    ]);
  });

  it("should correcly generate csv format", () => {
    const csv = generateCsv(investments, companies);
    expected =
      "|User|First Name|Last Name|Date|Holding|Value|\n|1|Billy|Bob|2020-01-01|The Small Investment Company|1400|\n|2|Sheila|Aussie|2020-01-01|The Big Investment Company|10000|\n|2|Sheila|Aussie|2020-01-01|The Small Investment Company|10000|";
    expect(csv).toEqual(expected);
  });
});
