import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import ShopLayout from "../shop/ShopLayout";
import { Table } from "./Table";
import { UserSpendChart } from "./UserSpendChart";
import { DetailModal } from "./DetailModal";
import { FilterDropdown } from "./FilterDropdown";
import DataBlock from "../DataBlock";
import ApproveDeny from "./ApproveDeny";
import UserManagement from "./UserManagement";
import { Tabs, Tab, Box, Select, TableRow, TableCell } from "grommet";
import styled from "styled-components";
import { Context as SessionContext } from "../../context/SessionContext";
import { Context as OrderContext } from "../../context/OrderContext";
import SEO from "../seo";

const DashboardContainer = styled(Box)`
  min-height: 80vh;
  background: #f2f2f2;
`;

const PaddedSelectContainer = styled.div`
  padding-left: 20px;
`;

const ResponsiveBox = styled(Box)`
  @media (max-width: 732px) {
    flex-flow: wrap;
  }
`;

const PaddedBox = styled(Box)`
  padding: 20px;
`;

const StyledSelect = styled(Select)`
  max-width: 300px;
`;

const ClickableRow = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background: white;
  }
`;

const Dashboard = ({
  userData,
  userHeaders,
  userSpendData,
  chartData,
  tooltipContent,
  headers,
  modalTitle,
  modalData,
  userDetails,
  filter,
  orderData,
  dropdownItems,
  handleFilter,
  approveOrDenyOrders,
  setActiveOrder
}) => {
  const [showOrders, setShowOrders] = useState("all");
  const [currentOrder, setCurrentOrder] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [year, setYear] = useState(moment().format("YYYY"));
  const { state: orders, getOrdersForStore } = useContext(OrderContext);
  const {
    state: { store: currentStore }
  } = useContext(SessionContext);

  const formattedYear = year === "all" ? year : moment(year).format("YYYY");
  const yearSelect = (
    <StyledSelect
      value={formattedYear}
      onChange={({ option }) => setYear(option)}
      options={["all", 2020, 2019, 2018]}
      placeholder="select"
    />
  );

  const handleOrderRowClick = orderID => {
    setCurrentOrder(orders.find(o => o.orderID === orderID));
    setShowModal(true);
  };

  const hasApproval = currentStore.managerPortal && currentStore.managerPortal.approval;

  useEffect(() => {
    if (currentStore.storeID) {
      getOrdersForStore(currentStore.storeID);
      setApprovedOrders(
        // currentStore.managerPortal && currentStore.managerPortal.approval
        //   ? orders.filter(o => o.status === "approved"):
        orders.filter(o => o.status === "open")
      );

    }
  }, [currentStore]);

  const companyTotal = orders.reduce((a, c) => a + +c.total, 0);
  const totalSpendRemaining = 238.32;
  const totalOrders = (
    <DataBlock label={"Number of Orders"} value={orders.length} />
  );
  const averageOrderTotal = (
    <DataBlock
      label={"Average Order Total"}
      value={`$${(companyTotal / orders.length).toFixed(2)}`}
    />
  );
  const totalSpend = (
    <DataBlock
      label={`Total Spend ${formattedYear}`}
      value={`$${companyTotal.toFixed(2)}`}
    />
  );
  const spendRemaining = (
    <DataBlock
      label={`Amount Remaining ${formattedYear}`}
      value={`$${+totalSpendRemaining.toFixed(2)}`}
    />
  );

  const tableHeaders = (
    <TableRow>
      <TableCell>Order ID</TableCell>
      <TableCell>Date</TableCell>
      <TableCell>Employee</TableCell>
      <TableCell>Total</TableCell>
    </TableRow>
  );

  const tableData = orders.map(o => (
    <ClickableRow onClick={() => handleOrderRowClick(o.orderID)}>
      <TableCell>{o.orderID}</TableCell>
      <TableCell>{moment(o.orderDate).format("MM/DD/YYYY")}</TableCell>
      <TableCell>{o.user && o.user.name}</TableCell>
      <TableCell>{o.total}</TableCell>
    </ClickableRow>
  ));
  return (
    <ShopLayout>
      <SEO title={`Quartermaster - ${currentStore.name}`} />
      <DashboardContainer>
        <Box direction="row">
          <p>Filter by Year:</p>
          {yearSelect}
          {filter && dropdownItems.length > 0 && <p>{filter}</p>}
          {filter && dropdownItems.length > 0 && (
            <FilterDropdown
              filter={filter}
              dropdownItems={dropdownItems}
              handleFilter={handleFilter}
            />
          )}
        </Box>

        <Tabs id="managerPortal-tabs" style={{ marginTop: "20px" }}>
          <Tab title="Summary">
            <Box>
              <ResponsiveBox direction="row" align="center">
                <Box direction="row" wrap={true} justify="center">
                  {totalSpend}
                  {spendRemaining}
                  {totalOrders}
                  {averageOrderTotal}
                </Box>
                <UserSpendChart
                  chartData={chartData}
                  tooltipContent={tooltipContent}
                />
              </ResponsiveBox>
            </Box>
          </Tab>
          <Tab title="Orders">
            <PaddedSelectContainer>
              <p>View by:</p>
              <StyledSelect
                value={showOrders}
                onChange={({ option }) => setShowOrders(option)}
                options={["all", "employee"]}
                placeholder="select"
              />
            </PaddedSelectContainer>
            <PaddedBox>
              {showOrders === "employee" && (
                <Table headers={userHeaders} tableData={userSpendData} />
              )}
              {showOrders === "all" && (
                <Table headers={tableHeaders} tableData={tableData} />
              )}
            </PaddedBox>
            <DetailModal
              modalTitle={`Order #${currentOrder.orderID}`}
              orderData={currentOrder}
              userDetails={userDetails}
              showModal={showModal}
              setShowModal={setShowModal}
              modalLoading={modalLoading}
            />
          </Tab>
          {hasApproval && (
            <Tab title="Approve/Deny">
              <ApproveDeny
                orderData={orders.filter(o => o.status === "pending")}
              />
            </Tab>
          )}
          <Tab title="Manage Users">
            <UserManagement />
          </Tab>
        </Tabs>
      </DashboardContainer>
    </ShopLayout>
  );
};

export default Dashboard;
