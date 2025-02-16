import { createServer, Model } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,
    models: {
      employee: Model,
    },

    seeds(server) {
    
      server.create("employee", {
        id: "1",
        name: "Michelle Hill",
        designation: "CEO",
        team: "Management",
        manager: null,
        tel: "01 213 123 134",
        email: "mark.hill@company.com",
        image: "/images/mark-hill.jpg",
      });

      server.create("employee", {
        id: "2",
        name: "Joe Linux",
        designation: "CTO",
        team: "Tech",
        manager: "1",
        tel: "01 213 123 135",
        email: "joe.linux@company.com",
        image: "/images/joe-linux.jpg",
      });
      server.create("employee", {
        id: "3",
        name: "Sarah Connor",
        designation: "CFO",
        team: "Finance",
        manager: "1",
        tel: "01 213 123 136",
        email: "sarah.connor@company.com",
        image: "/images/sarah-connor.jpg",
      });
      server.create("employee", {
        id: "4",
        name: "John Doe",
        designation: "COO",
        team: "Operations",
        manager: "1",
        tel: "01 213 123 137",
        email: "john.doe@company.com",
        image: "/images/john-doe.jpg",
      });

      server.create("employee", {
        id: "5",
        name: "Owen Hunt",
        designation: "Senior Developer",
        team: "Tech",
        manager: "2",
        tel: "01 213 123 138",
        email: "alice.brown@company.com",
        image: "/images/alice-brown.jpg",
      });
      server.create("employee", {
        id: "6",
        name: "Bob Smith",
        designation: "Junior Developer",
        team: "Tech",
        manager: "2",
        tel: "01 213 123 139",
        email: "bob.smith@company.com",
        image: "/images/bob-smith.jpg",
      });

      
      server.create("employee", {
        id: "7",
        name: "Charlie Johnson",
        designation: "Financial Analyst",
        team: "Finance",
        manager: "3",
        tel: "01 213 123 140",
        email: "charlie.johnson@company.com",
        image: "/images/charlie-johnson.jpg",
      });
      server.create("employee", {
        id: "8",
        name: "Diana Prince",
        designation: "Accountant",
        team: "Finance",
        manager: "3",
        tel: "01 213 123 141",
        email: "diana.prince@company.com",
        image: "/images/diana-prince.jpg",
      });

      server.create("employee", {
        id: "9",
        name: "Ethan Hunt",
        designation: "Operations Manager",
        team: "Operations",
        manager: "4",
        tel: "01 213 123 142",
        email: "ethan.hunt@company.com",
        image: "/images/ethan-hunt.jpg",
      });
      server.create("employee", {
        id: "10",
        name: "Fiona Gallagher",
        designation: "Logistics Coordinator",
        team: "Operations",
        manager: "4",
        tel: "01 213 123 143",
        email: "fiona.gallagher@company.com",
        image: "/images/fiona-gallagher.jpg",
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/employees", (schema) => {
        return schema.employees.all();
      });

      this.put("/employees/:id", (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        let employee = schema.employees.find(id);
        return employee.update(attrs);
      });
    },
  });

  return server;
}
