package com.example.healthyhelper.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.healthyhelper.R
import com.example.healthyhelper.network.RetrofitClient
import com.example.healthyhelper.network.container.ContainerDetailsResponse
import com.example.healthyhelper.network.container.FilledCompartmentResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ContainerCompartmentFragment : Fragment() {

    private val args: ContainerCompartmentFragmentArgs by navArgs()



    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_container_compartment, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val containerTitle = view.findViewById<TextView>(R.id.containerTitle)
        val statusText = view.findViewById<TextView>(R.id.statusText)
        val networkText = view.findViewById<TextView>(R.id.networkText)
        val compartmentList = view.findViewById<LinearLayout>(R.id.compartmentList)

        val containerId = args.containerId
        var patientId: Int? = null
        val btnBack = view.findViewById<ImageButton>(R.id.btnBack)

        btnBack.setOnClickListener {
            findNavController().popBackStack()
        }

        RetrofitClient.containerApi.getContainerDetails(mapOf("containerId" to containerId))
            .enqueue(object : Callback<ContainerDetailsResponse> {
                override fun onResponse(
                    call: Call<ContainerDetailsResponse>,
                    response: Response<ContainerDetailsResponse>
                ) {
                    val data = response.body() ?: return

                    containerTitle.text = "Container №${data.container_number}"
                    statusText.text = "Status: ${data.status}"
                    networkText.text = if (data.status.lowercase() == "active") "Network: Connected" else "Network: Not connected"
                    patientId = data.patientId
                }

                override fun onFailure(call: Call<ContainerDetailsResponse>, t: Throwable) {
                    Toast.makeText(requireContext(), "Не вдалося завантажити контейнер", Toast.LENGTH_SHORT).show()
                }
            })

        RetrofitClient.containerApi.getFilledCompartments(mapOf("containerId" to containerId))
            .enqueue(object : Callback<List<FilledCompartmentResponse>> {
                override fun onResponse(
                    call: Call<List<FilledCompartmentResponse>>,
                    response: Response<List<FilledCompartmentResponse>>
                ) {
                    val list = response.body() ?: return
                    compartmentList.removeAllViews()

                    list.forEach { item ->
                        val view = layoutInflater.inflate(R.layout.item_compartment, compartmentList, false)

                        val number = view.findViewById<TextView>(R.id.compartmentTitle)
                        val status = view.findViewById<TextView>(R.id.compartmentStatus)
                        val medInfo = view.findViewById<TextView>(R.id.medicationInfo)
                        val btnAdd = view.findViewById<Button>(R.id.btnAddMed)
                        val btnClear = view.findViewById<Button>(R.id.btnClearMed)

                        number.text = "№${item.compartment_number}"

                        if (item.isFilled) {
                            val time = item.intake_time?.substring(11, 16) ?: "??:??"
                            medInfo.text = "${item.medication} - ${item.quantity} табл. - $time"
                            medInfo.visibility = View.VISIBLE

                            status.text = "заповнено о ${item.fill_time?.substring(11, 16)} ✅"
                            btnAdd.visibility = View.GONE
                            btnClear.visibility = View.VISIBLE
                        } else {
                            status.text = "не заповнено 😕"
                            medInfo.visibility = View.GONE
                            btnAdd.visibility = View.VISIBLE
                            btnClear.visibility = View.GONE
                        }

                        btnAdd.setOnClickListener {
                            if (patientId == null) {
                                Toast.makeText(requireContext(), "Пацієнт не закріплений", Toast.LENGTH_SHORT).show()
                                return@setOnClickListener
                            }
                            val dialog = AddMedicationDialogFragment(
                                patientId = patientId!!,
                                compartmentId = item.compartment_id,
                                containerId = containerId
                            )
                            dialog.show(parentFragmentManager, "AddMedicationDialog")
                        }

                        btnClear.setOnClickListener {
                            RetrofitClient.containerApi.clearCompartment(mapOf("compartmentId" to item.compartment_id))
                                .enqueue(object : Callback<Map<String, String>> {
                                    override fun onResponse(
                                        call: Call<Map<String, String>>,
                                        response: Response<Map<String, String>>
                                    ) {
                                        if (response.isSuccessful) {
                                            Toast.makeText(requireContext(), "Відсік №${item.compartment_number} очищено", Toast.LENGTH_SHORT).show()

                                            findNavController().popBackStack()
                                            findNavController().navigate(
                                                R.id.containerCompartmentFragment,
                                                Bundle().apply {
                                                    putInt("containerId", containerId)
                                                }
                                            )
                                        } else {
                                            Toast.makeText(requireContext(), "Помилка при очищенні", Toast.LENGTH_SHORT).show()
                                        }
                                    }

                                    override fun onFailure(call: Call<Map<String, String>>, t: Throwable) {
                                        Toast.makeText(requireContext(), "Помилка мережі: ${t.message}", Toast.LENGTH_SHORT).show()
                                    }
                                })
                        }
                        compartmentList.addView(view)
                    }
                }
                override fun onFailure(call: Call<List<FilledCompartmentResponse>>, t: Throwable) {
                    Toast.makeText(requireContext(), "Помилка завантаження", Toast.LENGTH_SHORT).show()
                }
            })
    }
}
