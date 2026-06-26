import React from "react";
import { ShieldCheck, Package, Activity, Truck } from "lucide-react";

const VendorSpotlights = () => {
  const vendors = [
    {
      name: "AeroDynamics Ltd.",
      icon: <Package className="w-8 h-8 text-black" />,
      badge: "Platinum Partner",
      iconStyle: "bg-primary-container text-white",
      description:
        "Specializing in high-velocity logistics and supply chain optimization components for global markets.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCAMLyRJkI1Sqbbt7Fg1t-sonhWRul5q3qrkzMreSW9nhX_01dogX2V80MdOEcLjSlfg916wW-_R67u4vmNqd5Q-OJz9Vrj5qMk4EncHNIwCo4_668X--jAOzZg-rnim94v-rxWTI4Nf2KGvkkJQCP65ak_273VXl_dHUKufioHfIf6qKMplEbLaHGYqgqlzRDNlCNN4l9Txb0ewV6TNIA49x909bubN_lGaRMguyuD9q5XS32qTImRCGOh7qFCM2T5ywdHE1bSoKc",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBYr0xlw4-9PWLsaFMsxA0muBmOpoQsZPVYSGYgQzmQcsu5DY8ZVzdZOPOBwhwTr4nd-YWnoIIcpeR8iqG8L52oY_TGVf5MACMdINw0p_B9RvLHfRpCwtN7M0NRtehgkSVY_OCQYCaPJJW2S99DB50T6JYei-baYNKI3JIX3NtG2kAEXq9NhPA83L1sBX60G_DXHpUMV2ZYuPsUyyX2pVwOxyfSXuyMsTCUQl8kZHgo7dopGco532i0aQH7tkYSJEIzjKraVA1FIrk",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBU6kceoORvvg-8ui97eAgMkFV8cdqRZESQIVq1rEidbHf2RoayErQ-7mwWmD7ObFHU0Kth55_6YbtYwoUE0lTNHs5sdXvbJM2E3Ri3-RpIqfKwJHqXH7QZkhJuYc5-c1ptHTy29HMhsmhwJ4noKLDI2UF_1kHapYGQVMQXM5wjaB6YV3UNqjSVc2TVrhd7t_CZ2W_pDBJmTumqSxHhpQ-oN8TgOUNla6zVhMElzzOEa2jkwhoBqJ1U6PhNqd-uyM6ab8DTQmxVRlc",
      ],
      actionText: "Visit Storefront",
    },
    {
      name: "Quant Systems",
      icon: <Activity className="w-8 h-8 text-black" />,
      badge: "Infrastructure Provider",
      iconStyle: "bg-secondary text-white",
      description:
        "Advanced monitoring and analytics infrastructure for real-time market data visualization and processing.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDVm-FVg-88iKW9i0tIXdyXtxrKxcsLktpdwnLEepocs-SQ1P0AOGZQKZKrXu36Tv2VD1dG1skOAijidKbYt8gbJTTWUqcl5nG14rxzdPSZPyV2B2hP1iAyOox7CGjJKGOE_I-vUPrAbweHvnRMcoeLRUiTdl1--KdGv4-YEUEPfnK-QbZcfwpTmF04LFSUfURQjel5w3OtuU0KgtUdYxeE6BEiTiP5JcHxQlxA5mbVABwjz389sbDe2G0H41eTd0oyotyakr21Pso",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCi9Yjs5JiKV-_yP_l3ZhmhSqOxIDkRuVXOdq285NMsPzxneShHWuzM8Dvs-_uS0Z-eA06RVaKxoiIA5OhDiGN1-DoFz1Wfray_6rf99w8RqXkf2cIB5qOk1dfn_T3TpHss18lFs7cxfkDKpz12Gp0ovE82jV8v7AxbYaP0K5UeAXokWdEaAcuzZaZna-eFMlaa6Pa8yw5xVZ7fhiCZEvBM8RDJy4QpEspJf5fjB1fYvIOE0KV56a7wXqxHbHPmNRTrjIB3QrbM8sE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4JD8CJbxNoMEY87SixZlsCw-8FJMlGt7IKvGmWC4fAzdgiYT-2e4wsFoS_xwd7aZu8ZX2-3XWKfkpRxtvRCVgM_IWmo_U3MD5AMRKjkfKumr0Iy071eZ968VYA3kt2NHqH-lfwkBheOiIdjhRcH11Ysgz-rzyVjXYiv7DfflxBglLEiDp9rEx64s_G5NkpbhdFddhYtVtUIo_3Vuc8KdHddXmcm6WnHno4ZmbZ_DVxzraplLhyX2eIwn3tR_za5-UUTO4GHMM7c4",
      ],
      actionText: "Explore Services",
    },
    {
      name: "Lumen Logistics",
      icon: <Truck className="w-8 h-8 text-black" />,
      badge: "Delivery Expert",
      iconStyle: "bg-primary text-white",
      description:
        "Premium freight and last-mile fulfillment infrastructure specialized for delicate high-value technical assets.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwX9QMGs_arvFfVaTcC_2MaVKvpDbtYsPrblty0bDVzgGt5Lqor5B6VqxFUGuJ7QXASvZ047ZMnVUn5ypwSuL6Ya4psSM8ZXk7tXs9t5MeNhoXv8K46eGGmfwQrEv1gT5VxznR0NMk_cVrPtmnAMmANkO-e1xxRDLqkIUX2Tpv9y1wNw51dJd9SGVYKvDIQ6ZQSMPmfCmSshIaOt9urrGy1p-AALOrabgyFn8DqvcCIiyzc7um7kQ2sm8TeGvSmD4zas3AlJ1aV3M",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJCdZb_AhcuyX0x_F66KHXs85o25_mYNtGZWbZtDECXijbnevgqlXEa0-YGVLEh1LhrKJBjixGP0pj4xepSLy3QUzqSfThgipxWwb3wx2UHOB2lA9_jmvs0uU6AJbx493wkESD_z2xEVqDh94jqHT3gIbQjU8uzH6scknJd8t-2fYeKjBeyaTOrSkQYhUYDzdOW5c_vfoT6pRpfPHL7wqBYZQ9Q-ltUTkZ1LfG5r_-02VUsh1kPUepEXx4YDdetFOk-YJ7-YAwEc0",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD39KBsYfxRXWhDcR4mmuLrZVyPGUrOM_hPoGh1FqTtFfz4U_602nRzg8NDeKY0wocFHNhYy0Pzy-S2l4ijienwLN8QV4p7IwvmbJ5qDxKe0NZzartkKMPvAqHjBANpG0FbGtbq3bj_emscF9IR_SPk8v3kYTMBqWXQXL6mGSPRMUCMq2F_kdyKk3aPFP_9aQcKKytSdhlJ3gp237tTdSEoeKK7Jw3HEAjMbX4MF2Gwey0GXxSeE6Xmm5Kg80l4jCToO0QK4xZdKIE",
      ],
      actionText: "View Storefront",
    },
  ];

  return (
    <section className="mb-12">
      {/* Decorative Title Component */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-outline-variant flex-1"></div>
        <h2 className="text-headline-lg font-headline-lg text-primary px-4">
          Vendor Spotlights
        </h2>
        <div className="h-px bg-outline-variant flex-1"></div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vendors.map((vendor, index) => (
          <div
            key={index}
            className="premium-card p-6 border-2 border-transparent hover:border-secondary transition-all flex flex-col justify-between rounded-2xl shadow-sm"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${vendor.iconStyle}`}
                >
                  {vendor.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{vendor.name}</h3>
                  <div className="flex items-center text-secondary text-sm font-medium gap-1 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-secondary" />{" "}
                    {vendor.badge}
                  </div>
                </div>
              </div>

              <p className="text-on-surface-variant text-body-md mb-4">
                {vendor.description}
              </p>

              {/* Asset Images Mini-Grid */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {vendor.images.map((imgSrc, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="aspect-square bg-surface-container rounded-lg overflow-hidden border border-outline-variant/10"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={imgSrc}
                      alt={`Asset portfolio component ${imgIdx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-2.5 bg-surface-container-high text-primary rounded-lg font-bold hover:bg-secondary hover:text-white transition-all text-label-md font-label-md mt-auto">
              {vendor.actionText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorSpotlights;
