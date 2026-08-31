/**
 * Schéma HR simulé, calqué sur l'exemple livré avec Oracle Database.
 *
 * Extrait de la page du bac à sable : le moteur SQL et son jeu de données
 * n'ont rien à faire dans un composant d'interface, et les tests ont besoin
 * d'y accéder sans monter React.
 */

export type SchemaTable = {
  columns: string[];
  data: any[][];
};

export const schema: Record<string, SchemaTable> = {
  employees: {
    columns: [
      "EMPLOYEE_ID",
      "FIRST_NAME",
      "LAST_NAME",
      "EMAIL",
      "PHONE_NUMBER",
      "HIRE_DATE",
      "JOB_ID",
      "SALARY",
      "COMMISSION_PCT",
      "MANAGER_ID",
      "DEPARTMENT_ID",
    ],
    data: [
      [100, "Steven", "King", "SKING", "515.123.4567", "2003-06-17", "AD_PRES", 24000, null, null, 90],
      [101, "Neena", "Kochhar", "NKOCHHAR", "515.123.4568", "2005-09-21", "AD_VP", 17000, null, 100, 90],
      [102, "Lex", "De Haan", "LDEHAAN", "515.123.4569", "2001-01-13", "AD_VP", 17000, null, 100, 90],
      [103, "Alexander", "Hunold", "AHUNOLD", "590.423.4567", "2006-01-03", "IT_PROG", 9000, null, 102, 60],
      [104, "Bruce", "Ernst", "BERNST", "590.423.4568", "2007-05-21", "IT_PROG", 6000, null, 103, 60],
      [107, "Diana", "Lorentz", "DLORENTZ", "590.423.5567", "2007-02-07", "IT_PROG", 4200, null, 103, 60],
      [124, "Kevin", "Mourgos", "KMOURGOS", "650.123.5234", "2007-11-16", "ST_MAN", 5800, null, 100, 50],
      [141, "Susan", "Mavris", "SMAVRIS", "515.123.7777", "2002-06-07", "HR_REP", 6500, null, 101, 40],
      [142, "Curtis", "Davies", "CDAVIES", "515.124.4369", "2002-01-24", "HR_REP", 3100, null, 101, 40],
      [143, "Randall", "Matos", "RMATOS", "515.124.4230", "2006-03-15", "ST_CLERK", 2600, null, 124, 50],
      [144, "Peter", "Vargas", "PVARGAS", "515.124.4169", "2006-07-09", "ST_CLERK", 2500, null, 124, 50],
      [149, "Eleni", "Zlotkey", "EZLOTKEY", "011.44.1344.4290", "2005-01-29", "SA_MAN", 10500, 0.2, 100, 80],
      [174, "Ellen", "Abel", "EABEL", "011.44.1644.429264", "2004-05-11", "SA_REP", 11000, 0.3, 149, 80],
      [176, "Jonathon", "Taylor", "JTAYLOR", "011.44.1644.429265", "2006-03-24", "SA_REP", 8600, 0.2, 149, 80],
      [200, "Jennifer", "Whalen", "JWHALEN", "515.123.4444", "2003-09-17", "AD_ASST", 4400, null, 101, 10],
      [201, "Michael", "Hartstein", "MHARTSTE", "515.123.5555", "2004-02-17", "MK_MAN", 13000, null, 100, 20],
      [202, "Pat", "Fay", "PFAY", "603.123.6666", "2005-08-17", "MK_REP", 6000, null, 201, 20],
      [205, "Shelley", "Higgins", "SHIGGINS", "515.123.8080", "2002-06-07", "AC_MGR", 12008, null, 101, 110],
      [206, "William", "Gietz", "WGIETZ", "515.123.8181", "2002-06-07", "AC_ACCOUNT", 8300, null, 205, 110],
    ],
  },
  departments: {
    columns: ["DEPARTMENT_ID", "DEPARTMENT_NAME", "MANAGER_ID", "LOCATION_ID"],
    data: [
      [10, "Administration", 200, 1700],
      [20, "Marketing", 201, 1800],
      [40, "Human Resources", 203, 2400],
      [50, "Shipping", 121, 1500],
      [60, "IT", 103, 1400],
      [80, "Sales", 145, 2500],
      [90, "Executive", 100, 1700],
      [110, "Accounting", 205, 1700],
    ],
  },
  jobs: {
    columns: ["JOB_ID", "JOB_TITLE", "MIN_SALARY", "MAX_SALARY"],
    data: [
      ["AD_PRES", "President", 20080, 40000],
      ["AD_VP", "Administration Vice President", 15000, 30000],
      ["AD_ASST", "Administration Assistant", 3000, 6000],
      ["IT_PROG", "Programmer", 4000, 10000],
      ["ST_MAN", "Stock Manager", 5500, 8500],
      ["ST_CLERK", "Stock Clerk", 2000, 5000],
      ["HR_REP", "Human Resources Representative", 4000, 9000],
      ["SA_MAN", "Sales Manager", 10000, 20080],
      ["SA_REP", "Sales Representative", 6000, 12008],
      ["MK_MAN", "Marketing Manager", 9000, 15000],
      ["MK_REP", "Marketing Representative", 4000, 9000],
      ["AC_MGR", "Accounting Manager", 8200, 16000],
      ["AC_ACCOUNT", "Public Accountant", 4200, 9000],
    ],
  },
};
