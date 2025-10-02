import { CustomerModel, CustomerMetaModel } from "@/src/types/customer/customer-type";

// Convert a single CustomerModel → CustomerMetaModel
export const toCustomerMetaModel = (customer: CustomerModel): CustomerMetaModel => ({
  customerID: customer.customerID ?? "",
  userId: customer.userId ?? "",
  firstName: customer.customerBasicInfo?.firstName ?? "",
  lastName: customer.customerBasicInfo?.lastName ?? "",
  mobileNumber: customer.customerBasicInfo?.mobileNumber ?? "",
  email: customer.customerBasicInfo?.email ?? "",
  gender: customer.customerBasicInfo?.gender,
  createdDate: customer.createdDate
});


// Convert list of CustomerModel[] → CustomerMetaModel[]
export const toCustomerMetaModelList = (customers: CustomerModel[]): CustomerMetaModel[] =>
  customers.map(toCustomerMetaModel);
