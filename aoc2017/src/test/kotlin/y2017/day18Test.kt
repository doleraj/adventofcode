package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day18Test {
    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.addAll(line.split(",")) }
        return lines
    }

    @Test
    fun test1() {
        assertEquals(4, day18(parseFile("2017/day18TestInput.txt")))

    }

    @Test
    fun test1Actual() {
        assertEquals(3423, day18(parseFile("2017/day18ActualInput.txt")))
    }

    @Test
    fun test2() {
        assertEquals(3, day18Second(parseFile("2017/day18TestInput2.txt")))

    }


    @Test
    fun testActualSecond() {
        assertEquals(20430489, day18Second(parseFile("2017/day18ActualInput.txt")))
    }
}