import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ==================================================
// GLOBAL
// ==================================================

const packagesCollection = collection(db, "packages");


// ==================================================
// MOBILE MENU
// ==================================================

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}


// ==================================================
// PACKAGE ID
// ==================================================

const urlParams = new URLSearchParams(window.location.search);
const packageId = urlParams.get("id");


// ==================================================
// STORE
// ==================================================

const packagesGrid = document.querySelector(".packages-grid");


async function loadStorePackages() {

    if (!packagesGrid) {
        return;
    }

    try {

        packagesGrid.innerHTML = `
            <p class="loading-message">
                جاري تحميل الباكدجات...
            </p>
        `;

        const snapshot = await getDocs(packagesCollection);

        console.log("عدد الباكدجات:", snapshot.size);

        packagesGrid.innerHTML = "";

        if (snapshot.empty) {

            packagesGrid.innerHTML = `
                <p class="empty-message">
                    لا توجد باكدجات حاليًا.
                </p>
            `;

            return;
        }


        snapshot.forEach((packageDocument) => {

            const packageData = packageDocument.data();

            const card = document.createElement("article");
            card.className = "package-card";


            // IMAGE
            const imageBox = document.createElement("div");
            imageBox.className = "package-image";

            const image = document.createElement("img");

            image.src =
                packageData.image ||
                "assets/images/package-1.jpg";

            image.alt =
                packageData.name || "باكدج";

            image.loading = "lazy";

            imageBox.appendChild(image);


            // CONTENT
            const content = document.createElement("div");
            content.className = "package-content";


            // NAME
            const title = document.createElement("h3");

            title.textContent =
                packageData.name || "باكدج بدون اسم";


            // DESCRIPTION
            const description = document.createElement("p");

            description.textContent =
                packageData.description || "";


            // BOTTOM
            const bottom = document.createElement("div");
            bottom.className = "package-bottom";


            // PRICE
            const price = document.createElement("strong");

            price.textContent =
                packageData.price
                    ? `${packageData.price} جنيه`
                    : "السعر غير محدد";


            // DETAILS BUTTON
            const detailsButton =
                document.createElement("a");

            detailsButton.href =
                `product.html?id=${packageDocument.id}`;

            detailsButton.className = "btn";

            detailsButton.textContent =
                "عرض التفاصيل";


            bottom.appendChild(price);
            bottom.appendChild(detailsButton);

            content.appendChild(title);
            content.appendChild(description);
            content.appendChild(bottom);

            card.appendChild(imageBox);
            card.appendChild(content);

            packagesGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "حدث خطأ أثناء تحميل الباكدجات:",
            error
        );

        packagesGrid.innerHTML = `
            <div class="error-message">
                <p>
                    حصل خطأ أثناء تحميل الباكدجات.
                </p>

                <small>
                    افتح Console لمعرفة سبب المشكلة.
                </small>
            </div>
        `;
    }
}


// ==================================================
// PRODUCT DETAILS PAGE
// ==================================================

async function loadProduct() {

    const productName =
        document.querySelector("#productName");

    if (!productName || !packageId) {
        return;
    }


    try {

        const packageRef =
            doc(db, "packages", packageId);

        const packageSnap =
            await getDoc(packageRef);


        if (!packageSnap.exists()) {

            console.error("الباكدج غير موجودة.");

            return;
        }


        const packageData =
            packageSnap.data();


        // NAME
        const nameElement =
            document.querySelector("#productName");

        if (nameElement) {
            nameElement.textContent =
                packageData.name || "";
        }


        // PRICE
        const priceElement =
            document.querySelector("#productPrice");

        if (priceElement) {
            priceElement.textContent =
                packageData.price
                    ? `${packageData.price} جنيه`
                    : "";
        }


        // DESCRIPTION
        const descriptionElement =
            document.querySelector("#productDescription");

        if (descriptionElement) {
            descriptionElement.textContent =
                packageData.description || "";
        }


        // MAIN IMAGE
        const productImage =
            document.querySelector("#productImage");

        if (productImage) {

            productImage.src =
                packageData.image ||
                "assets/images/package-1.jpg";

            productImage.alt =
                packageData.name || "";
        }


        // GALLERY
        const productGallery =
            document.querySelector("#productGallery");

        if (productGallery) {

            productGallery.innerHTML = "";

            const gallery =
                Array.isArray(packageData.gallery)
                    ? packageData.gallery
                    : [];


            gallery.forEach((imageUrl) => {

                if (!imageUrl) {
                    return;
                }


                const thumbnail =
                    document.createElement("img");

                thumbnail.src =
                    imageUrl;

                thumbnail.alt =
                    packageData.name || "";

                thumbnail.className =
                    "product-gallery-image";


                thumbnail.addEventListener(
                    "click",
                    () => {

                        if (productImage) {

                            productImage.src =
                                imageUrl;
                        }

                    }
                );


                productGallery.appendChild(
                    thumbnail
                );

            });
        }


        // PRODUCTS
        const productsList =
            document.querySelector(
                "#packageProductsList"
            );


        if (productsList) {

            productsList.innerHTML = "";

            const products =
                Array.isArray(packageData.products)
                    ? packageData.products
                    : [];


            products.forEach((product) => {

                if (!product) {
                    return;
                }


                const item =
                    document.createElement("div");

                item.className =
                    "package-product-item";

                item.textContent =
                    product;

                productsList.appendChild(item);

            });
        }


        // DETAILS
        const featuresList =
            document.querySelector(
                "#productFeatures"
            );


        if (featuresList) {

            featuresList.innerHTML = "";

            const details =
                packageData.details || "";


            details
                .split("\n")
                .map(line => line.trim())
                .filter(line => line !== "")
                .forEach((detail) => {

                    const li =
                        document.createElement("li");


                    const cleanDetail =
                        detail.startsWith("•")
                            ? detail.substring(1).trim()
                            : detail;


                    li.textContent =
                        `✓ ${cleanDetail}`;


                    featuresList.appendChild(li);

                });
        }


        // ORDER BUTTON
        const orderButton =
            document.querySelector("#orderButton");


        if (orderButton) {

            orderButton.href =
                `order.html?id=${packageId}`;
        }


    } catch (error) {

        console.error(
            "خطأ في تحميل تفاصيل الباكدج:",
            error
        );

    }
}


// ==================================================
// ORDER PAGE
// ==================================================

const orderForm =
    document.querySelector("#orderForm");


let orderPackage = null;


async function loadOrderPackage() {

    if (!orderForm || !packageId) {
        return;
    }


    try {

        const packageRef =
            doc(db, "packages", packageId);

        const packageSnap =
            await getDoc(packageRef);


        if (!packageSnap.exists()) {

            console.error(
                "الباكدج المطلوبة غير موجودة."
            );

            return;
        }


        orderPackage =
            packageSnap.data();


        // IMAGE
        const summaryImage =
            document.querySelector("#summaryImage");

        if (summaryImage) {

            summaryImage.src =
                orderPackage.image ||
                "assets/images/package-1.jpg";

            summaryImage.alt =
                orderPackage.name || "";
        }


        // NAME
        const summaryName =
            document.querySelector("#summaryName");

        if (summaryName) {

            summaryName.textContent =
                orderPackage.name || "";
        }


        // DESCRIPTION
        const summaryDescription =
            document.querySelector(
                "#summaryDescription"
            );

        if (summaryDescription) {

            summaryDescription.textContent =
                orderPackage.description || "";
        }


        // PRICE
        const summaryPrice =
            document.querySelector("#summaryPrice");

        if (summaryPrice) {

            summaryPrice.textContent =
                orderPackage.price
                    ? `${orderPackage.price} جنيه`
                    : "";
        }


    } catch (error) {

        console.error(
            "خطأ في تحميل بيانات الطلب:",
            error
        );

    }
}


if (orderForm) {

    loadOrderPackage();


    orderForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (!orderPackage) {

                alert(
                    "لم نتمكن من تحميل بيانات الباكدج."
                );

                return;
            }


            const name =
                document.querySelector("#name")
                    ?.value
                    .trim();


            const phone =
                document.querySelector("#phone")
                    ?.value
                    .trim();


            const governorate =
                document.querySelector("#governorate")
                    ?.value;


            const address =
                document.querySelector("#address")
                    ?.value
                    .trim();


            const notes =
                document.querySelector("#notes")
                    ?.value
                    .trim();


            if (
                !name ||
                !phone ||
                !governorate ||
                !address
            ) {

                alert(
                    "من فضلك أكمل البيانات المطلوبة."
                );

                return;
            }


            const message =
                `طلب جديد من موقع مستر توحيد

الباكدج: ${orderPackage.name || ""}
السعر: ${orderPackage.price || ""} جنيه

اسم العميل: ${name}
رقم الهاتف: ${phone}
المحافظة: ${governorate}
العنوان: ${address}
ملاحظات: ${notes || "لا توجد"}`;


            const whatsappNumber =
                "201515641899";


            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );
}


// ==================================================
// DASHBOARD
// ==================================================

const addPackageBtn =
    document.querySelector("#addPackageBtn");

const packageModal =
    document.querySelector("#packageModal");

const closePackageModal =
    document.querySelector("#closePackageModal");

const packageForm =
    document.querySelector("#packageForm");

const dashboardPackages =
    document.querySelector("#dashboardPackages");

const modalTitle =
    document.querySelector("#modalTitle");

const savePackageBtn =
    document.querySelector("#savePackageBtn");


let editingPackageId = null;


// ==================================================
// OPEN ADD MODAL
// ==================================================

if (addPackageBtn && packageModal) {

    addPackageBtn.addEventListener(
        "click",
        () => {

            editingPackageId = null;

            if (modalTitle) {
                modalTitle.textContent =
                    "إضافة باكدج";
            }

            if (savePackageBtn) {
                savePackageBtn.textContent =
                    "حفظ الباكدج";
            }

            if (packageForm) {
                packageForm.reset();
            }

            packageModal.classList.add("active");

        }
    );
}


// ==================================================
// CLOSE MODAL
// ==================================================

if (closePackageModal && packageModal) {

    closePackageModal.addEventListener(
        "click",
        () => {

            packageModal.classList.remove("active");

        }
    );
}


// ==================================================
// LOAD DASHBOARD
// ==================================================

async function loadDashboardPackages() {

    if (!dashboardPackages) {
        return;
    }


    try {

        dashboardPackages.innerHTML = `
            <p>جاري تحميل الباكدجات...</p>
        `;


        const snapshot =
            await getDocs(packagesCollection);


        dashboardPackages.innerHTML = "";


        if (snapshot.empty) {

            dashboardPackages.innerHTML = `
                <p>
                    لا توجد باكدجات حاليًا.
                </p>
            `;

            return;
        }


        snapshot.forEach((packageDocument) => {

            const packageData =
                packageDocument.data();


            const card =
                document.createElement("div");

            card.className =
                "dashboard-package-card";


            const info =
                document.createElement("div");

            info.className =
                "dashboard-package-info";


            const title =
                document.createElement("h3");

            title.textContent =
                packageData.name || "";


            const description =
                document.createElement("p");

            description.textContent =
                packageData.description || "";


            const price =
                document.createElement("strong");

            price.textContent =
                packageData.price
                    ? `${packageData.price} جنيه`
                    : "بدون سعر";


            info.appendChild(title);
            info.appendChild(description);
            info.appendChild(price);


            const actions =
                document.createElement("div");

            actions.className =
                "dashboard-package-actions";


            const editButton =
                document.createElement("button");

            editButton.type =
                "button";

            editButton.className =
                "btn edit-package-btn";

            editButton.textContent =
                "تعديل";


            const deleteButton =
                document.createElement("button");

            deleteButton.type =
                "button";

            deleteButton.className =
                "delete-package-btn";

            deleteButton.textContent =
                "حذف";


            actions.appendChild(editButton);
            actions.appendChild(deleteButton);


            card.appendChild(info);
            card.appendChild(actions);


            dashboardPackages.appendChild(card);


            editButton.addEventListener(
                "click",
                () => {
                    editPackage(packageDocument.id);
                }
            );


            deleteButton.addEventListener(
                "click",
                () => {
                    deletePackage(packageDocument.id);
                }
            );

        });


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        dashboardPackages.innerHTML = `
            <p>
                حصل خطأ أثناء تحميل الباكدجات.
            </p>
        `;

    }
}


// ==================================================
// EDIT PACKAGE
// ==================================================

async function editPackage(id) {

    if (!packageModal) {
        return;
    }


    try {

        const packageRef =
            doc(db, "packages", id);

        const packageSnap =
            await getDoc(packageRef);


        if (!packageSnap.exists()) {

            alert(
                "الباكدج غير موجودة."
            );

            return;
        }


        const data =
            packageSnap.data();


        editingPackageId = id;


        const packageName =
            document.querySelector("#packageName");

        const packagePrice =
            document.querySelector("#packagePrice");

        const packageImage =
            document.querySelector("#packageImage");

        const packageGallery =
            document.querySelector("#packageGallery");

        const packageDescription =
            document.querySelector("#packageDescription");

        const packageDetails =
            document.querySelector("#packageDetails");

        const packageProducts =
            document.querySelector("#packageProducts");


        if (packageName) {
            packageName.value =
                data.name || "";
        }


        if (packagePrice) {
            packagePrice.value =
                data.price || "";
        }


        if (packageImage) {
            packageImage.value =
                data.image || "";
        }


        if (packageGallery) {

            packageGallery.value =
                Array.isArray(data.gallery)
                    ? data.gallery.join("\n")
                    : "";
        }


        if (packageDescription) {
            packageDescription.value =
                data.description || "";
        }


        if (packageDetails) {
            packageDetails.value =
                data.details || "";
        }


        if (packageProducts) {

            packageProducts.value =
                Array.isArray(data.products)
                    ? data.products.join("\n")
                    : "";
        }


        if (modalTitle) {
            modalTitle.textContent =
                "تعديل الباكدج";
        }


        if (savePackageBtn) {
            savePackageBtn.textContent =
                "حفظ التعديل";
        }


        packageModal.classList.add("active");


    } catch (error) {

        console.error(
            "Edit Error:",
            error
        );

        alert(
            "حصل خطأ أثناء تحميل الباكدج."
        );

    }
}


// ==================================================
// DELETE PACKAGE
// ==================================================

async function deletePackage(id) {

    const confirmed =
        confirm(
            "هل أنت متأكد من حذف هذه الباكدج؟"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "packages", id)
        );


        alert(
            "تم حذف الباكدج بنجاح ✅"
        );


        await loadDashboardPackages();
        await loadStorePackages();


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );


        alert(
            "حصل خطأ أثناء حذف الباكدج."
        );

    }
}


// ==================================================
// ADD / UPDATE PACKAGE
// ==================================================

if (packageForm) {

    packageForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document.querySelector(
                    "#packageName"
                )?.value
                    .trim();


            const price =
                document.querySelector(
                    "#packagePrice"
                )?.value
                    .trim();


            const description =
                document.querySelector(
                    "#packageDescription"
                )?.value
                    .trim();


            const details =
                document.querySelector(
                    "#packageDetails"
                )?.value
                    .trim();


            const image =
                document.querySelector(
                    "#packageImage"
                )?.value
                    .trim();


            const galleryText =
                document.querySelector(
                    "#packageGallery"
                )?.value
                    .trim();


            const productsText =
                document.querySelector(
                    "#packageProducts"
                )?.value
                    .trim();


            const gallery =
                galleryText
                    ? galleryText
                        .split(/\r?\n/)
                        .map(url => url.trim())
                        .filter(Boolean)
                    : [];


            const products =
                productsText
                    ? productsText
                        .split(/\r?\n/)
                        .map(product => product.trim())
                        .filter(Boolean)
                    : [];


            if (!name || !price) {

                alert(
                    "من فضلك أدخل اسم الباكدج والسعر."
                );

                return;
            }


            const packageData = {

                name,
                price,
                description,
                details,
                image,
                gallery,
                products

            };


            try {

                // UPDATE
                if (editingPackageId) {

                    await updateDoc(
                        doc(
                            db,
                            "packages",
                            editingPackageId
                        ),
                        packageData
                    );


                    alert(
                        "تم تعديل الباكدج بنجاح ✅"
                    );

                }

                // ADD
                else {

                    await addDoc(
                        packagesCollection,
                        {
                            ...packageData,
                            createdAt: serverTimestamp()
                        }
                    );


                    alert(
                        "تم إضافة الباكدج بنجاح ✅"
                    );

                }


                editingPackageId = null;


                packageForm.reset();


                if (packageModal) {
                    packageModal.classList.remove("active");
                }


                await loadDashboardPackages();
                await loadStorePackages();


            } catch (error) {

                console.error(
                    "Firebase Error:",
                    error
                );


                alert(
                    "حصل خطأ أثناء حفظ الباكدج. افتح Console لمعرفة السبب."
                );

            }

        }
    );
}


// ==================================================
// START
// ==================================================

loadStorePackages();

loadProduct();

loadDashboardPackages();
