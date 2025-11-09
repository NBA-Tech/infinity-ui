import { CustomerModel, CustomerMetaModel } from "@/src/types/customer/customer-type";

// Convert a single CustomerModel → CustomerMetaModel
export const toCustomerMetaModel = (customer: CustomerModel): CustomerMetaModel => ({
  customerID: customer.customerID ?? "",
  userId: customer.userId ?? "",
  name: customer.customerBasicInfo?.name ?? "",
  mobileNumber: customer.customerBasicInfo?.mobileNumber ?? "",
  email: customer.customerBasicInfo?.email ?? "",
  createdDate: customer.createdDate
});


// Convert list of CustomerModel[] → CustomerMetaModel[]
export const toCustomerMetaModelList = (customers: CustomerModel[]): CustomerMetaModel[] =>
  customers.map(toCustomerMetaModel);
