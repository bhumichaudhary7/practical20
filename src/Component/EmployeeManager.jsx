import React, { useEffect, useState } from "react";

function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", salary: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) =>
        setEmployees(data.slice(0, 4).map((e) => ({
          id: e.id, name: e.name, role: "Developer", salary: "30000"
        })))
      )
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setEmployees(employees.map((emp) =>
        emp.id === editId ? { ...form, id: editId } : emp
      ));
      setEditId(null);
    } else {
      setEmployees([...employees, { ...form, id: Date.now() }]);
    }

    setForm({ name: "", role: "", salary: "" });
  };

  const editEmployee = (emp) => {
    setForm({ name: emp.name, role: emp.role, salary: emp.salary });
    setEditId(emp.id);
  };

  const deleteEmployee = (id) =>
    setEmployees(employees.filter((emp) => emp.id !== id));

  return (
    <div className="employee-app">
      <h1>Employee Management</h1>
      <p className="subtitle">Manage your team in one place</p>

      <form onSubmit={handleSubmit} className="employee-form">
        <input placeholder="Employee Name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Job Role" required value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <input type="number" placeholder="Monthly Salary (₹)" min="1"
          required value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        <button type="submit">{editId ? "Update Employee" : "Add Employee"}</button>
        {editId && <button type="button" className="cancel"
          onClick={() => {
            setEditId(null);
            setForm({ name: "", role: "", salary: "" });
          }}>Cancel</button>}
      </form>

      <h2>Employee List ({employees.length})</h2>

      {employees.length === 0 ? (
        <p className="empty">No employees found. Add your first employee!</p>
      ) : (
        employees.map((emp) => (
          <div className="employee-card" key={emp.id}>
            <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
            <div className="details">
              <h3>{emp.name}</h3>
              <p>{emp.role}</p>
              <strong>₹{Number(emp.salary).toLocaleString("en-IN")}</strong>
            </div>
            <div className="actions">
              <button className="edit" onClick={() => editEmployee(emp)}>Edit</button>
              <button className="delete" onClick={() => deleteEmployee(emp.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeManager;